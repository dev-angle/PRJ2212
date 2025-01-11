const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {
  beforeUpdate(event) {
    const result = event.params.data;
    if (result) {
      const dom = new JSDOM(result.content);
      const doc = dom.window.document;
      console.log({ doc });

      // find all header tags in the document
      const headers = doc.querySelectorAll("h1, h2");

      // table of contents list
      let toc = `<ul style="list-style-type: disc">`;

      // max header node h6
      let lastNode = 6;

      // if list is indented
      let indented = false;

      headers.forEach((header, index) => {
        // get current header node number i.e 1,2,...,6
        let currentNode = parseInt(header.nodeName.at(-1));
        let text = header.textContent.toLowerCase().replace(/\s/g, "-");

        /**
        if lastNode was h2 and currentNode is h3 then add indentation to the list
          or continue identation if both nodes are same and list was indented
        else continue adding elements in list without identation
        **/
        if (currentNode > lastNode || (currentNode == lastNode && childNode)) {
          toc = childNode ? toc : toc + "<ul style='text-indent:20px'>";
          toc += `<li><a href="#${text}">${header.textContent}</a></li>`;
          childNode = true;
        } else {
          toc = childNode ? toc + "</ul>" : toc;
          toc += `<li><a href="#${text}">${header.textContent}</a></li>`;
          childNode = false;
        }

        lastNode = currentNode;
        header.setAttribute("id", `${text}`);
      });

      // update content with updated headers
      event.params.data.content = dom.serialize();

      // assign generated toc to the field
      event.params.data.toc = toc += "</ul>";
    }
  },
};
