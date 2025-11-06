# my_blog  
A simple Django website using templates.

## Description  
This project is built with Django and uses Django’s template system to render pages with HTML & CSS. It’s great for a small content site or blog.  
Live site: https://gkablog.com/
## Features  
- Django views and templates for dynamic pages.  
- Static files support (CSS, images).  
- Clean URL routing.  
- Easy to extend: add new apps, pages, templates.  

## Tech Stack  
- Python (3.x)  
- Django  
- HTML / CSS templates  
- SQLite for development (or configure PostgreSQL for production)  

## Setup & Installation  
```bash
git clone <REPO_URL> my_blog
cd my_blog
python3 -m venv venv
source venv/bin/activate   # on Windows: venv\Scripts\activate
pip install -r requirements.txt 
```

Then open http://127.0.0.1:8000/ in your browser.

## Usage

Place your HTML templates in the templates/ folder of your app or project.
Put your CSS/JS/images in the static/ directory.
Define your views in views.py and map them in urls.py.
To add a new page: create a template + view + URL entry.


