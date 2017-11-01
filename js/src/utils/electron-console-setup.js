/*const entityMap = {
  "&" : "&amp;",
  "<" : "&lt;",
  ">" : "&gt;",
  "\"" : "&quot;",
  "'" : "&#39;",
  "/" : "&#x2F;",
  "\n": "<br>",
  "\t": "&nbsp&nbsp&nbsp&nbsp"
};

function escapeHtml(string)
{
    return String(string).replace(/[&<>"'\/\n]/g, function(s)
    {
        return entityMap[s];
    });
}*/
const {Console} = require("console");
const nodeConsole = new Console(process.stdout, process.stderr);

function setupConsole(consoles)
{
    var methods = ["error", "warn", "info", "log", "debug"];
    for(let method of methods)
    {
        console["o" + method] = console[method];
        console[method] = function()
        {
            if(consoles.chrome)
            {
                console["o" + method](...arguments);
            }
            if(consoles.node)
            {
                let form = arguments[0];
                if(typeof form == "string")
                {
                  arguments[0] = form.replace(/%[Oo]/g, "%j");
                }
                nodeConsole[method](...arguments)
            }
            /*if(consoles.html)
            {
                var text = "";
                for(var j in arguments)
                {
                    var arg = arguments[j];
                    switch(typeof arg)
                    {
                        case "string":
                            text += escapeHtml(arg);
                            break;
                        case "number":
                        case "boolean":
                            text += arg.toString();
                            break;
                        default:
                            text += JSON.stringify(arg);
                    }
                    text += "<br>";
                }
                for(let element of document.getElementsByClassName("windowConsole"))
                {
                  var type = $(this).data('consoleType');
                  if(type && type.indexOf(method.charAt(0)))
                  {
                      $(this).append(text);
                  }
                }
            }*/
        }.bind(console);
    }
    console.log("Logging to %O", consoles);
}

module.exports = setupConsole;
