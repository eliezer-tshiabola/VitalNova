# API VitalNova

Backend Django REST de VitalNova. SQLite et le serveur `runserver` sont réservés au développement local. La production exige PostgreSQL, Redis, SMTP et HTTPS.

## Installation locale

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Les variables du fichier `.env` ne sont pas chargées automatiquement afin de ne pas masquer une mauvaise configuration. Définissez-les dans l’environnement du processus ou utilisez le gestionnaire de secrets de l’hébergeur.

## API v1

- `GET /api/v1/health/`
- `GET /api/v1/categories/`
- `GET /api/v1/products/`
- `POST /api/v1/orders/`
- `GET|POST /api/v1/reviews/`
- `POST /api/v1/auth/register/`
- `POST /api/v1/auth/login/`
- `POST /api/v1/auth/refresh/`
- `POST /api/v1/auth/logout/`
- `GET|PATCH /api/v1/auth/me/`
- `POST /api/v1/auth/verify-email/request/`
- `POST /api/v1/auth/verify-email/confirm/`
- `POST /api/v1/auth/password-reset/request/`
- `POST /api/v1/auth/password-reset/confirm/`

L’administration est disponible au chemin défini par `DJANGO_ADMIN_PATH`.

## Vérifications

```powershell
python manage.py check
python manage.py test
python manage.py makemigrations --check --dry-run
```

Pour la production, exécutez également `python manage.py check --deploy --settings=config.settings.production` avec toutes les variables requises.
