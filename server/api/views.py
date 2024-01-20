from django.shortcuts import render
import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import _EnsureCsrfCookie
from django.views.decorators.http import require_POST

# Create your views here.
@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    
    if username is None and password is None:
        return JsonResponse({'detail':'Please provide a username and password'})
    
    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({'detail':'Invalid credentials'}, status=400)
    login(request, user)
    return JsonResponse({'detail':'Successfully logged in!'})

def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail':'You are not logged in!'}, status=400)
    logout(request)
    return JsonResponse({'detail':'Successfully logged out!'})

@_EnsureCsrfCookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isauthenticated':False})
    return JsonResponse({'isauthenticated':True})

def whois_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isauthenticated':False})
    return JsonResponse({'username':request.user.username})

