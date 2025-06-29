import TagWithAttributes from '../types/TagWithAttributes';

interface FindElementsByHierarchyOptions {
  hierarchy: TagWithAttributes[];
  from?: HTMLElement | Element;
  directChildren?: boolean;
  showLogs?: boolean;
}

const findElementsByHierarchy = (options: FindElementsByHierarchyOptions): HTMLElement[] => {
  const {
    hierarchy,
    from = document.body,
    directChildren = false,
    showLogs = false
  } = options;

  let currentElements: HTMLElement[] = [from as HTMLElement];

  if (showLogs) {
    console.log('Starting findElementsByHierarchy with options:', {
      hierarchyLength: hierarchy.length,
      from: from.tagName,
      directChildren,
      showLogs
    });
  }

  for (let i = 0; i < hierarchy.length; i++) {
    const hierarchyItem = hierarchy[i];
    if (!hierarchyItem) continue;
    
    const { tag, attributes } = hierarchyItem;
    const matchingElements: HTMLElement[] = [];

    if (showLogs) {
      console.log(`\nLevel ${i + 1}: Searching for <${tag}> elements`);
      console.log(`Current parent elements count: ${currentElements.length}`);
    }

    for (const parentElement of currentElements) {
      let elementsToCheck: HTMLElement[] = [];

      if (directChildren) {
        // Search only direct children
        const children = parentElement.children;
        for (let j = 0; j < children.length; j++) {
          const child = children[j] as HTMLElement;
          if (child.tagName.toLowerCase() === tag.toLowerCase()) {
            elementsToCheck.push(child);
          }
        }
        if (showLogs) {
          console.log(`Found ${elementsToCheck.length} direct children with tag <${tag}>`);
        }
      } else {
        // Search all descendants (current behavior)
        const allElements = parentElement.getElementsByTagName(tag);
        for (let j = 0; j < allElements.length; j++) {
          elementsToCheck.push(allElements[j] as HTMLElement);
        }
        if (showLogs) {
          console.log(`Found ${elementsToCheck.length} descendant elements with tag <${tag}>`);
        }
      }

      for (const element of elementsToCheck) {
        let match = true;

        if (showLogs && attributes.length > 0) {
          console.log(`\nChecking element:`, element);
        }

        for (const { attribute, value, isRegex, contains } of attributes) {
          let attrValue: string | null;

          if (attribute === 'innerHTML') {
            attrValue = element.innerHTML;
          } else if (attribute === 'innerText') {
            attrValue = element.innerText;
          } else {
            attrValue = element.getAttribute(attribute);
          }

          if (showLogs) {
            console.log(`  Checking attribute '${attribute}': expected='${value}', actual='${attrValue}'`);
          }

          if (attrValue === null) {
            if (showLogs) {
              console.log(`  Attribute '${attribute}' not found - no match`);
            }
            match = false;
            break;
          }

          if (isRegex) {
            let regex: RegExp;
            try {
              regex = new RegExp(value);
            } catch (error) {
              console.error(`Padrão regex inválido: ${value}`, error);
              match = false;
              break;
            }

            if (!regex.test(attrValue)) {
              if (showLogs) {
                console.log(`  Regex pattern '${value}' didn't match '${attrValue}'`);
              }
              match = false;
              break;
            } else if (showLogs) {
              console.log(`  Regex pattern '${value}' matched!`);
            }
          } else if (contains) {
            if (!attrValue.includes(value)) {
              if (showLogs) {
                console.log(`  Value '${value}' not contained in '${attrValue}'`);
              }
              match = false;
              break;
            } else if (showLogs) {
              console.log(`  Value '${value}' found in attribute!`);
            }
          } else if (attrValue !== value) {
            if (showLogs) {
              console.log(`  Exact match failed: '${value}' !== '${attrValue}'`);
            }
            match = false;
            break;
          } else if (showLogs) {
            console.log(`  Exact match found!`);
          }
        }

        if (match) {
          if (showLogs) {
            console.log(`✓ Element matched all criteria`);
          }
          matchingElements.push(element);
        }
      }
    }

    if (matchingElements.length === 0) {
      if (showLogs) {
        console.log(`\n❌ No matching elements found at level ${i + 1}. Stopping search.`);
      }
      return []; // Não encontrou nenhum elemento correspondente neste nível
    }

    if (showLogs) {
      console.log(`\n✓ Found ${matchingElements.length} matching elements at level ${i + 1}`);
    }

    currentElements = matchingElements; // Avança para o próximo nível com os elementos filtrados
  }

  if (showLogs) {
    console.log(`\n✅ Final result: ${currentElements.length} elements found`);
  }

  // Retorna todos os elementos encontrados no último nível
  return currentElements;
};

export default findElementsByHierarchy;
