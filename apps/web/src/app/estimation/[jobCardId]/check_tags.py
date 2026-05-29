import re

def check_tags():
    with open('/Users/adityapradhan/Documents/bikemaster/apps/web/src/app/estimation/[jobCardId]/page.tsx', 'r') as f:
        content = f.read()
    
    # Slice the file starting from line 550 (the main return block)
    lines = content.split('\n')
    jsx_content = '\n'.join(lines[549:]) # line 550 is index 549
    
    # Strip comments to avoid false matches
    jsx_content = re.sub(r'{\s*/\*.*?\*/\s*}', '', jsx_content, flags=re.DOTALL)
    jsx_content = re.sub(r'//.*?\n', '\n', jsx_content)
    
    # Find all JSX opening and closing tags. Self-closing tags end with /> and are ignored.
    tags = re.findall(r'<([a-zA-Z0-9]+)(?:\s+[^>]*?)?(?<!/)>|</([a-zA-Z0-9]+)>', jsx_content)
    
    stack = []
    for op, cl in tags:
        if op:
            if op.lower() not in ['img', 'input', 'br', 'hr']:
                stack.append(op)
        elif cl:
            if stack and stack[-1] == cl:
                stack.pop()
            else:
                print(f"Mismatched closing tag: </{cl}>. Expected match for: {stack[-1] if stack else 'None'}")
                if stack:
                    print(f"Stack trace: {stack[-5:]}")
                return
    
    if stack:
        print(f"Unclosed tags in JSX block: {stack}")
    else:
        print("All JSX tags matched successfully!")

if __name__ == '__main__':
    check_tags()
