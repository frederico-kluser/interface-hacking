export type TagAttribute = { attribute: string; value: string; isRegex?: boolean };

export interface TagWithAttributes {
  tag: string;
  attributes: TagAttribute[];
}

const findElementsByHierarchy = (
  hierarchy: TagWithAttributes[],
  from: HTMLElement | Element = document.body,
): HTMLElement[] => {
  let currentElements: HTMLElement[] = [from as HTMLElement];

  for (const { tag, attributes } of hierarchy) {
    const matchingElements: HTMLElement[] = [];

    for (const parentElement of currentElements) {
      const allElements = parentElement.getElementsByTagName(tag);

      for (let j = 0; j < allElements.length; j += 1) {
        const element = allElements[j] as HTMLElement;
        let match = true;

        for (const { attribute, value, isRegex } of attributes) {
          let attrValue: string | null;

          if (attribute === 'innerHTML') {
            attrValue = element.innerHTML;
          } else if (attribute === 'innerText') {
            attrValue = element.innerText;
          } else {
            attrValue = element.getAttribute(attribute);
          }

          if (attrValue === null) {
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
              match = false;
              break;
            }
          } else if (attrValue !== value) {
            match = false;
            break;
          }
        }

        if (match) {
          matchingElements.push(element);
        }
      }
    }

    if (matchingElements.length === 0) {
      return []; // Não encontrou nenhum elemento correspondente neste nível
    }

    currentElements = matchingElements; // Avança para o próximo nível com os elementos filtrados
  }

  // Retorna todos os elementos encontrados no último nível
  return currentElements;
};

export default findElementsByHierarchy;
