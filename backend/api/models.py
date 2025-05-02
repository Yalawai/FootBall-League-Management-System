from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


# Create your models here.
class Ground(models.Model):
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name



class GroundImage(models.Model):
    ground = models.ForeignKey(Ground, related_name='team_ground', on_delete=models.CASCADE)
    ground_img = models.ImageField(upload_to='ground_img')


    def __str__(self) -> str:
        return self.ground.name
    




class Team(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank = True, max_length= 200)
    coach = models.CharField(max_length=50)
    logo = models.ImageField(upload_to='team_logo/')
    ground = models.ForeignKey(Ground, related_name='ground', on_delete=models.CASCADE)

    
    def __str__(self) -> str:
        return self.name


    def get_recent_form(self, season, num_matches=5):
        form_entries = TeamForm.objects.filter(team=self, match__fixture__season = season ).order_by('-match')[:num_matches]
        return [entry.form for entry in form_entries]


class Position(models.Model):
    name = models.CharField(max_length=5, unique=True)

    def __str__(self) -> str:
        return self.name





class Player(models.Model):
    name = models.CharField(max_length=50)
    dateOfBirth = models.DateField()
    position = models.ManyToManyField(Position, related_name='players')
    dzongkhag = models.CharField(max_length=20)
    player_img = models.ImageField(upload_to='player_img/')
    team = models.ForeignKey(Team, related_name='team', on_delete=models.CASCADE, default= 1)
    

    def __str__(self) -> str:
        return self.name + self.team.name
    



class Season(models.Model):
    name = models.CharField(max_length=50)
    startDate = models.DateField()
    endDate = models.DateField()

    def __str__(self) -> str:
        return self.name
    

class Fixture(models.Model):

    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='season')
    homeTeam = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='home_team')
    awayTeam = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='away_team')
    dateTime = models.DateTimeField()
    play_field = models.ForeignKey(Ground, related_name='play_ground', on_delete=models.CASCADE)
    
   

    def __str__(self) -> str:
        return self.season.name + self.homeTeam.name +' vs '+ self.awayTeam.name + self.dateTime.strftime('%Y-%m-%d %H:%M')





    
  

class PlayMatch(models.Model):
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Ongoing', 'Ongoing'),
        ('Completed', 'Completed'),
    ]


    fixture = models.OneToOneField(Fixture, related_name='fixture', on_delete=models.CASCADE, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    homeScore = models.IntegerField(default=0)
    awayScore = models.IntegerField(default=0)
    result = models.CharField(max_length=1, choices=[('H', 'Home Win'), ('A', 'Away Win'), ('D', 'Draw')], null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.status == "Completed":
            if self.homeScore > self.awayScore:
                self.result = 'H'
            elif self.homeScore < self.awayScore:
                self.result = 'A'
            else:
                self.result = 'D'
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.fixture.season.name + self.fixture.homeTeam.name +' vs '+self.fixture.awayTeam.name + self.fixture.dateTime.strftime('%Y-%m-%d %H:%M')
    
    
class TeamForm(models.Model):
    team = models.ForeignKey(Team, related_name='forms', on_delete=models.CASCADE)
    match = models.ForeignKey(PlayMatch, related_name='form_entries', on_delete=models.CASCADE)
    form = models.CharField(max_length=1, choices=[('W', 'Win'), ('L', 'Loss'), ('D', 'Draw')])
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        unique_together = ('team', 'match')

    def __str__(self):
        return f"{self.team} - {self.form} in {self.match}"



    

class Event(models.Model):
    EVENT_CHOICES = [
        ('G', 'Goal'),
        ('I', 'Injured'),
        ('Y', 'Yellow Card'),
        ('R', 'Red Card'),
        ('S', 'Substitution'),
        ('F', 'Foul'),
        ('O', 'Offside'),
        ('C', 'Corner'),
        ('FK', 'Free Kick'),
        ('SG', 'Self Goal / Own Goal'),
        ('A', 'Assists'),
        ('P', 'Penalty')
    ]

    playMatch = models.ForeignKey(PlayMatch, on_delete=models.CASCADE, related_name='events')
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='event_player')
    substitute_player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='substitute_player', null=True, blank=True)
    homeTeam = models.BooleanField(default=True)
    eventType = models.CharField(choices=EVENT_CHOICES, max_length=2)
    event_minute = models.PositiveIntegerField(help_text="Minute of the event in the match", default=0)
    extra_time = models.PositiveIntegerField(null=True, blank=True, help_text="Extra time minute if applicable")

    def __str__(self) -> str:
        return f"{self.player.name} ({self.get_eventType_display()})"

    def clean(self):
        # Ensure the player and substitute_player belong to the teams in the match if event type is Substitution
        if self.eventType == 'S':
            match = self.playMatch.fixture
            teams = [match.homeTeam, match.awayTeam]
            if self.player.team not in teams or self.substitute_player.team not in teams:
                raise ValidationError("Players involved in a substitution must belong to the teams playing the match.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @property
    def display_event_time(self):
        if self.extra_time:
            return f"{self.event_minute} + {self.extra_time}'"
        return f"{self.event_minute}'"

    def __str__(self) -> str:
        return self.player.name + self.player.team.name + self.eventType



    


class LeagueTable(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)
    matches_played = models.PositiveIntegerField(default=0)
    wins = models.PositiveIntegerField(default=0)
    draws = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    goals_scored = models.PositiveIntegerField(default=0)
    goals_conceded = models.PositiveIntegerField(default=0)
    goal_difference = models.IntegerField(default=0)
    points = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('team', 'season')
        ordering = ['-points', '-goal_difference', '-goals_scored']

    def __str__(self):
        return f"{self.team.name} - {self.season.name}"

    def update_stats(self, match):
        """
        Update the league table based on the match result.
        """
        home_team = match.fixture.homeTeam
        away_team = match.fixture.awayTeam

        if self.team == home_team:
            self.matches_played += 1
            self.goals_scored += match.homeScore
            self.goals_conceded += match.awayScore
            self.goal_difference = self.goals_scored - self.goals_conceded
            if match.homeScore > match.awayScore:
                self.wins += 1
                self.points += 3
            elif match.homeScore == match.awayScore:
                self.draws += 1
                self.points += 1
            else:
                self.losses += 1
        elif self.team == away_team:
            self.matches_played += 1
            self.goals_scored += match.awayScore
            self.goals_conceded += match.homeScore
            self.goal_difference = self.goals_scored - self.goals_conceded
            if match.awayScore > match.homeScore:
                self.wins += 1
                self.points += 3
            elif match.awayScore == match.homeScore:
                self.draws += 1
                self.points += 1
            else:
                self.losses += 1

        self.save()



class News(models.Model):

    categoryChoices = [
        ('Transfer News','Transfer News'),
        ("Club News","Club News"),
        ("Match Reports",
        "Match Reports"),
        ("Injury Updates",
        "Injury Updates"),
        ("Training Updates",
        'Training Updates'),
        ('Player Interviews',
        'Player Interviews'),
        ('Manager Interviews',
        'Manager Interviews'),
        ('Fan News',
        'Fan News'),
        ("League Announcements",
        'League Announcements')
    ]


    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.CharField(max_length=100)
    published_date = models.DateField(default=timezone.now)
    category = models.CharField(choices=categoryChoices, max_length=40)
    image = models.ImageField(upload_to='news_images/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    video_url = models.URLField(max_length=500, null=True, blank=True)  # Field for video URL
    video_file = models.FileField(upload_to='news_videos/', null=True, blank=True)

    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title


class Sponser(models.Model):

    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='sponser/', blank=True, null=True)

    def __str__(self) -> str:
        return self.name
