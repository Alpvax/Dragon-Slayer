"use strict"

const Output = document.getElementById("output-table");

const Message = {
  "addElement": function (data) {
    let row = document.createElement("TR");

    let entity = document.createElement("TD");
    entity.classList.add("entity");
    entity.innerHTML = data.entity;

    let content = document.createElement("TD");
    content.classList.add("messages");
    content.innerHTML = data.content;

    row.appendChild(entity);
    row.appendChild(content);

    Output.appendChild(row);

    // Scroll to bottom on new output
    let scrollOutput = document.getElementById("output");
    scrollOutput.scrollTop = Output.scrollHeight;
  }
};

module.exports = Message;
