import { Component, OnInit } from '@angular/core';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})


export class WorkspaceComponent implements OnInit {

  constructor() { }
  workspace: any
  presentationCode = '//Your code here!';
  mainCode = '//Your code here! \n int main(){printf("Olá mundo");}';
  oldCode = '';

  ngOnInit() {
    this.workspace = document.getElementById('workspace');
    this.workspace.onkeypress = function (e) {
      if (e.which == 13) {

        document.execCommand('insertHTML', false, '/n');
        this.mainCode = this.presentationCode;
        // prevent the default behaviour of return key pressed
        return false;
      }
    };

  }


  verifyText(event) {

    let s = document.getSelection();
    let range = document.createRange();


    let w = document.getElementById('workspace');
    let carretOffset = this.getCaretCharacterOffsetWithin(w);

    this.mainCode = event.target.textContent;
    console.log(w)

    this.highLightItens();

    this.setCarretOffset(range, s, w, carretOffset);

  }

  setCarretOffset(range, sel, element: Element, offset) {

    var currentNode = null;
    var previousNode = null;

    for (var i = 0; i < element.childNodes.length; i++) {
      //save previous node
      previousNode = currentNode;

      //get current node
      currentNode = element.childNodes[i];
      //if we get span or something else then we should get child node
      while (currentNode.childNodes.length > 0) {
        currentNode = currentNode.childNodes[0];
      }

      //calc offset in current node
      if (previousNode != null) {
        offset -= previousNode.length;
      }
      //check whether current node has enough length
      if (offset <= currentNode.length) {
        break;
      }
    }
    //move caret to specified offset
    if (currentNode != null) {
      range.setStart(currentNode, offset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != "Control") {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }

  highLightItens() {
    this.mainCode = this.replaceAll(this.mainCode, 'int ', '<span class="command-types">int </span>');
    this.mainCode = this.replaceAll(this.mainCode, '/n', '<br>');

    console.log(this.mainCode)
    this.workspace.innerHTML = this.mainCode;
    this.oldCode = this.mainCode;
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);

  }
  gsetCaretCharacterOffsetWithin() {
    if (this.mainCode.length != this.oldCode.length) {
      for (let i = 0; i < this.mainCode.length; i++) {
        if (this.mainCode[i] != this.oldCode[i]) {

          return i;
        }
      }
    }
  }
}
