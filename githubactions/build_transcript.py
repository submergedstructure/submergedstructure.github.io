

import urllib.parse

import requests

import json

import os

import unicodedata
import re

"""# Helper Functions"""

def render_template(template_path, context=None):
    if context is None:
        context = {}
    with open(template_path, 'r', encoding='utf-8') as file:
        template = file.read()
    
    for key, value in context.items():
        placeholder = '{{' + key + '}}'  # Adjust based on your placeholder format
        template = template.replace(placeholder, value)
    
    return template

def get_json_response (url):
  lingq_api_key = os.environ.get('LINGQ_API_KEY')
  if not lingq_api_key:
    raise ValueError("LINGQ_API_KEY is not set in the environment variables.")  
  headers = {
    'Authorization': f'Token {lingq_api_key}',
    'Content-Type': 'application/json'
  }
  response = requests.get(f'{url}?page_size=1000', headers=headers)
  return response.json()

def print_json (json_parsed):
  print (json.dumps(json_parsed, indent = 4))

def legal_filename(filename):
    # Convert to ASCII, removing non-ASCII characters
    filename = unicodedata.normalize('NFKD', filename).encode('ascii', 'ignore').decode()
    
    # Replace remaining illegal characters with an underscore
    filename = re.sub(r'[^\w\-\. ]', '_', filename)
    
    # Remove leading and trailing whitespace, periods, and underscores
    filename = filename.strip(' ._')
    
    return filename


# Function to process text and return HTML with color-coded cases and tooltips
def process_and_display_paragraph(paragraph):
    highlighted_text = ""
    for token in doc:

      if token.pos_ == "PUNCT" :
        highlighted_text += token.text
      else :
        if not highlighted_text == "":
          highlighted_text += ' '
        # Retrieve morphological information
        case = token.morph.get("Case")
        morph = " ".join(f'{token.morph}'.split("|"))
        # Define the tooltip text
        tooltip_text = f"{token.lemma_} {token.pos_}"
        if morph:
            tooltip_text += f"<br> ({morph})"
        morph_features = f'{token.morph}'.split("|")
        morph_features = [morph_feature.replace("=", "_") for morph_feature in morph_features]
        morph_features.append(token.pos_)
        styling_class = " ".join(morph_features)

        # Append the token span with style and tooltip
        highlighted_text += f'<span class="{styling_class}" data-tooltip="{tooltip_text}">{token.text}</span>'

    return f"<p>{highlighted_text}</p>\n"
  
language_code = "pl"
lesson_id = 29053833
  
lesson = get_json_response(f'https://www.lingq.com/api/v3/{language_code}/lessons/{lesson_id}/')

transcript = '';
last_timestamp = 0;

for parts in lesson['tokenized_text']:
  text = parts[0]['text']
  if parts[0]['timestamp'] and parts[0]['timestamp'][0]:
    timestamp_start = int(float(parts[0]['timestamp'][0]) * 1000)
    timestamp_end = int(float(parts[0]['timestamp'][1]) * 1000)
    duration = timestamp_end - timestamp_start
    last_timestamp = timestamp_end
  else:
    timestamp = last_timestamp
    duration = 0
  transcript += f"<p data-m=\"{timestamp_start}\" data-d=\"{duration}\">{text}</p>\n"

html = render_template('templates/multiplayer_single.html', {'audio_url' : lesson['audioUrl']
                                                             'transcript' : transcript})

with open("gh-pages/test.html", "w", encoding="utf-8") as file:
  file.write(html)


#     filename = legal_filename(course['title'])
#     index_html += render_template('githubactions/templates/index_item_fragment.html',
#                                     {'course_title' : course['title'],
#                                    'filename': filename})


#     subfolder = "html_output/pl"
#     os.makedirs(subfolder, exist_ok=True)
#     html_file = os.path.join(subfolder, filename) + ".html"
#     if os.path.isfile(html_file):
#         continue

#     html = render_template('githubactions/templates/top_fragment_page.html',
#                                     {'course_title' : course['title'],
#                                      'reader_course_url' : f"https://www.lingq.com/en/learn/pl/web/library/course/{course_id}/",
#                                      'course_description' : course['description'],
#                                      'key_html' : key_html,
#                                      'js' : js})

    
#     for lesson in course['lessons']:
#         paragraphs = get_json_response(lesson['url'] + 'paragraphs/')
#         html += "<div class='lesson'>"
#         reader_lesson_url = f"https://www.lingq.com/en/learn/pl/web/reader/{lesson['id']}/"
#         html += f"<h2><a href=\"{reader_lesson_url}\" title=\"Link to Lingq Lesson\">{lesson['title']}</a></h2>"
#         for paragraph in paragraphs:
#             joined_sentences = ' '.join(sentence['cleanText'] for sentence in paragraph['sentences'])
#             html += process_and_display_paragraph(joined_sentences)
#         html += "</div>"

#     html += "</body></html>"



# index_html += f"""
# </ul>
# </body>
# """

# index_file = os.path.join(subfolder, "index.html")

# with open(index_file, "w", encoding="utf-8") as file:
#     file.write(index_html)