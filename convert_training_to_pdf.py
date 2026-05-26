from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
import re

input_path = 'artisticbuz-ai-training.md'
output_path = 'artisticbuz-ai-training.pdf'

with open(input_path, 'r', encoding='utf-8') as f:
    text = f.read()

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='MyHeading1', fontSize=18, leading=22, spaceAfter=12, spaceBefore=12, fontName='Helvetica-Bold'))
styles.add(ParagraphStyle(name='MyHeading2', fontSize=16, leading=20, spaceAfter=10, spaceBefore=10, fontName='Helvetica-Bold'))
styles.add(ParagraphStyle(name='MyHeading3', fontSize=14, leading=18, spaceAfter=8, spaceBefore=8, fontName='Helvetica-Bold'))
styles.add(ParagraphStyle(name='MyBodyText', fontSize=10.5, leading=14, spaceAfter=6, fontName='Helvetica'))
styles.add(ParagraphStyle(name='MyList', fontSize=10.5, leading=14, leftIndent=18, bulletIndent=10, spaceAfter=4, fontName='Helvetica'))

story = []

for line in text.splitlines():
    if line.startswith('# '):
        story.append(Paragraph(line[2:].strip(), styles['MyHeading1']))
    elif line.startswith('## '):
        story.append(Paragraph(line[3:].strip(), styles['MyHeading2']))
    elif line.startswith('### '):
        story.append(Paragraph(line[4:].strip(), styles['MyHeading3']))
    elif line.startswith('- '):
        story.append(Paragraph('• ' + line[2:].strip(), styles['MyList']))
    elif re.match(r'^[0-9]+\. ', line):
        story.append(Paragraph(line.strip(), styles['MyList']))
    elif line.strip() == '':
        story.append(Spacer(1, 6))
    else:
        processed = re.sub(r'\[(.*?)\]\((.*?)\)', r'\1 (\2)', line)
        processed = processed.replace('*', '')
        story.append(Paragraph(processed, styles['MyBodyText']))

pdf = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=inch, leftMargin=inch, topMargin=inch, bottomMargin=inch)
pdf.build(story)
print('PDF created:', output_path)
