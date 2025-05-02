from django.urls import path, include
from .views import PlayerList, PlayMatchViewSet, TeamViewSet, LeagueTableViewSet, FixtureViewSet, NewsViewSet, FeaturedNewsViewSet, SponserViewSet, SeasonViewSet, NewsDetailView, ResultsView, ResultDetailView

urlpatterns = [
    path('player/', PlayerList.as_view(), name='player-list'),
    path('matches/', PlayMatchViewSet.as_view(), name='match-list'),
    path('teams/', TeamViewSet.as_view(), name='team-list'),
    path('league-table/', LeagueTableViewSet.as_view(), name='league-table-list'),
    path('fixtures/', FixtureViewSet.as_view(), name='fixture-list'),
    path('news_list/', NewsViewSet.as_view(), name='news-list'),
    path('featurednews/', FeaturedNewsViewSet.as_view(), name='feature-news-list'),
    path('sponser/', SponserViewSet.as_view(), name='sponser'),
    path('seasons/', SeasonViewSet.as_view(), name='season'),
    path('news/<int:pk>/', NewsDetailView.as_view(), name='news-detail'),

    path('results_list/', ResultsView.as_view(), name='results'),
    path('result/<int:pk>/', ResultDetailView.as_view(), name='result-detail')

 
    
]