import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {FirebaseService} from '../../../../core/services/firebase';
import {RoomDataInterface} from '../../../../shared/interfaces/room-data.interface';
import {ButtonName} from '../../../../shared/enums/button-name';
import { map, switchMap, tap } from 'rxjs/operators';
import {forkJoin, from, of, pipe} from 'rxjs';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {AuthService} from '../../../../core/services/auth.service';
import {UserService} from '../../../user/services/user.service';
import {RatingService} from '../../../../shared/services/rating.service';
import {MoviePersonService} from '../../../movie-person/services/movie-person.service';
import {PersonInterface} from '../../../../shared/interfaces/person.interface';
import {PersonService} from '../../../person/services/person.service';

type CrewPerson = {
  id: string;
  name: string;
  image: string | null;
};

type CrewGroup = {
  role: string;
  people: CrewPerson[];
};

@Component({
  selector: 'app-room-page',
  standalone: false,

  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.css'
})

export class RoomPageComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('crewGroupContainer') crewGroupContainer!: ElementRef;

  protected roomId!: string;
  protected room!: RoomDataInterface;
  protected comments: any[] = [];
  protected ButtonName = ButtonName;
  protected sanitizedUrl!: SafeResourceUrl;

  protected newReviewText: string = '';
  protected countdown: number = 0;
  protected isAddReviewDisabled: boolean = false;
  protected countdownInterval: any;

  protected currentUserId: string = '';
  protected currentUserName: string = '';
  protected currentUserRoles: string[] = [];
  protected stars: number[] = Array(10).fill(0).map((_, i) => i + 1);
  protected averageRating: number = 0;
  protected ratingCount: number = 0;
  protected userRating: number | null = null;
  protected  hoveredStarIndex: number | null = null;
  protected currentUserLoaded = false;
  protected  isAdmin!: boolean;
  protected isModerator!: boolean
  protected showFullCastCrew = false;
  protected isCastCrewOverflow = false;

  castAndCrewGroupedByRole: CrewGroup[] = [];


  constructor(
    protected roomService: RoomService,
    protected firebaseService: FirebaseService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected sanitizer: DomSanitizer,
    protected authService: AuthService,
    protected userService: UserService,
    protected personService: PersonService,
    protected castService: MoviePersonService,
    protected ratingService: RatingService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.roomId = params['id'];

      this.ratingService.calculatePersonOrMovieAverageRating(this.roomId).subscribe({
        next: (res: any) => {
          if (res && res.averageRating && res.ratingsCount) {
            this.averageRating = res.averageRating ?? 0;
            this.ratingCount = res.ratingsCount ?? 0;
          } else {
            this.averageRating = 0;
            this.ratingCount = 0;
          }
        }
      })

      this.roomService.getRoom(this.roomId).subscribe({
        next: (d: RoomDataInterface) => {
          this.room = d;
          const embedUrl = this.getEmbedUrl(this.room.stream_url);

          if (embedUrl) {
            this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
          } else {
            this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
          }

          this.castService.getMovieCast(d.id).subscribe({
            next: (data: any) => {

              const grouped = data.reduce((acc: any, entry: any) => {
                const role = entry.person_role;
                if (!acc[role]) acc[role] = [];

                const alreadyExists = acc[role].some((p: any)=> p.id === entry.person.id);
                if (!alreadyExists) {
                  acc[role].push({
                    id: entry.person.id,
                    name: entry.person.name,
                    image: entry.person.images?.[0] ?? null,
                  });
                }

                return acc;
              },  {} as Record<string, CrewPerson[]>);
              const sortedRoles = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'en'));

              this.castAndCrewGroupedByRole = sortedRoles.map(role => {
                const sortedPeople = grouped[role].sort((a: any, b: any) => a.name.localeCompare(b.name, 'en'));
                return { role, people: sortedPeople };
              });

              this.cdr.detectChanges();
              this.checkOverflow();

            },
          })
        },
        error: e => console.error(e)
      });
      this.authService.isAuthenticated()
        .pipe(
          switchMap(isAuth => isAuth ? this.userService.getUserInfo() : of(null)))
        .subscribe((user: any)=> {
            if (user) {
              this.currentUserId    = user.id;
              this.currentUserName  = user.username;
              this.isAdmin          = user.roles.includes('admin');
              this.isModerator      = user.roles.includes('moderator');
              this.currentUserRoles = user.roles;
            }
            this.currentUserLoaded = true;


            try {
              this.firebaseService.getCommentsLive(this.roomId).subscribe({
                next: data => {
                  this.comments = data.map(c => this.addUserDataToComment(c));
                  // 2) force Angular to apply the new DOM
                  this.cdr.detectChanges();
                  this.scrollToBottom();
                },
                error: err => console.error('Live error:', err)
              });

            } catch (err) {
              console.error('Comment error:', err);
            }

        });

    });

    this.loadRating();
  }

  toggleShowMore() {
    this.showFullCastCrew = !this.showFullCastCrew;
  }

  checkOverflow() {
    if (!this.crewGroupContainer) return;

    const el = this.crewGroupContainer.nativeElement;
    this.isCastCrewOverflow = el.scrollHeight > el.clientHeight;
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.warn('Scroll to bottom failed', err);
    }
  }

  getEmbedUrl(youtubeUrl: string): string {
    const videoIdMatch = youtubeUrl.match(/(?:\?v=|\/embed\/|\.be\/)([\w-]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return youtubeUrl;
  }

  deleteComment(comment: any, index: number) {
    const isAdminOrModerator = this.currentUserRoles.includes('admin') || this.currentUserRoles.includes('moderator');
    const isOwnComment = comment.userId === this.currentUserId;

    if (isAdminOrModerator && !isOwnComment) {
      this.firebaseService.deleteComment(this.roomId, comment.id).subscribe({
        next: () => this.comments.splice(index, 1),
        error: err => console.error('Admin delete error:', err)
      });
    } else if (isOwnComment) {
      this.firebaseService.userDeleteOwnComment(this.currentUserId, this.roomId, comment.id).subscribe({
        next: () => this.comments.splice(index, 1),
        error: err => console.error('User delete error:', err)
      });
    } else {
      console.warn('You are not allowed to delete this comment.');
    }
  }

  banUserByComment(comment: any) {
    if (!comment.userId) return;
    this.userService.banUser(comment.userId).subscribe({
      next: () => {
        comment.status = 'banned';
        this.firebaseService.updateCommentsStatusByUserInRoom(comment.userId, this.roomId, {status: 'banned'}).subscribe({
          next: () => console.log('All comments marked banned'),
          error: err => console.error('Failed to update comment statuses', err)
        });
      },
      error: err => {
        console.error(err);
      },
    });
  }

  unbanUserByComment(comment: any) {
    if (!comment.userId) return;
    this.userService.unBanUser(comment.userId).subscribe({
      next: () => {
        comment.status = 'inactive';
        this.firebaseService.updateCommentsStatusByUserInRoom(comment.userId, this.roomId, {status: 'inactive'}).subscribe({
          next: () => console.log('All comments marked active'),
          error: err => console.error('Failed to update comment statuses', err)
        });
      },
      error: err => {
        console.error(err);
      },
    });
  }


  submitReview() {
    if (!this.newReviewText.trim()) return;

    this.isAddReviewDisabled = true;
    this.countdown = 5;

    this.firebaseService.addComment(this.roomId, { text: this.newReviewText }).subscribe({
      next: (res: any) => {
        this.comments.unshift({
          text: this.newReviewText,
          userId: this.currentUserId,
          userName: this.currentUserName,
          id: res['id']
        });
        this.newReviewText = '';
        this.startCountdown();
        this.scrollToBottom();
      },
      error: err => {
        console.error('Add review error:', err);
        this.isAddReviewDisabled = false;
      }
    });
  }

  onEnter() {
    if (!this.isAddReviewDisabled && this.newReviewText.trim()) {
      this.submitReview();
    }
  }


  startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.isAddReviewDisabled = false;
      }
    }, 1000);
  }

  loadRating() {
    this.ratingService.findOnePersonOrMovieRating(this.roomId).subscribe({
      next: (res: any) => {
        if(res && res.rating && res.ratingsCount) {
          this.averageRating = res.rating ?? 0;
          this.ratingCount = res.ratingsCount ?? 0;
        } else {
          this.averageRating = 0;
          this.ratingCount = 0;
        }
      },
      error: (err) => {
        console.error('Error loading rating:', err);
      }
    });
  }

  rateMovie(value: number) {
    this.userRating = value;
    this.hoveredStarIndex = null;
    this.stars = Array(10).fill(0).map((_, i) => i + 1);

    this.ratingService.addRating(this.roomId, { rating: value.toString() }).subscribe({
      next: (res: any) => {
        this.averageRating = res.averageRating ?? this.averageRating;
        this.ratingCount = res.ratingsCount ?? this.ratingCount;

        this.userRating = null;
      },
      error: (err) => {
        console.error('Error submitting rating:', err);
      }
    });
  }


  getStarClass(i: number): string {
    const base = this.hoveredStarIndex ?? this.averageRating;

    if (i + 1 <= Math.floor(base)) return 'filled';
    if (i < base && base < i + 1) return 'half-filled';
    return '';
  }

  addUserDataToComment(comment: any): any {
    const targetIsAdmin      = comment.role === 'admin';
    const targetIsModerator  = comment.role === 'moderator';

    const canModerate =
      (this.isAdmin     && !targetIsAdmin) ||
      (this.isModerator && !targetIsAdmin && !targetIsModerator);

    return {
      ...comment,
      canBan:   canModerate && comment.status !== 'banned' && comment.userId !== this.currentUserId,
      canUnban: canModerate && comment.status === 'banned' && comment.userId !== this.currentUserId,
      canDelete: this.isAdmin || this.isModerator || comment.userId === this.currentUserId
    };
  }

  getPersonImage(person: any) {
    if (person.image) {
      return this.personService.getImage(person.image);
    } else {
      return this.personService.getDefaultImage('default_person.jpg');
    }
  }

  castInfo(id: string) {
    this.router.navigateByUrl(`cast/${id}`)
  }

}
