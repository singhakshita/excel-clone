const $ = require("jquery");
const fs = require("fs");
const dialog = require("electron").remote.dialog;

$(document).ready(function(){
let db;
let lastClickedCell;
let lastSelectedCell;
$(".content-container").on("scroll",function(){
    let scrollY = $(this).scrollTop();
    let scrollX = $(this).scrollLeft();
    $("#top-row,#top-left-cell").css("top" , scrollY + "px");
    $("#top-left-cell,#left-col").css("left" , scrollX + "px");
})
$("#grid .cell").on("click" ,function(){
    let{ColId,RowId} =getRowCol(this);
    let value = String.fromCharCode(65+ColId)+(RowId+1);
    $("#Address-input").val(value);
    let cellObject = db[RowId][ColId];

    if(lastClickedCell && this != lastClickedCell){
        $(lastClickedCell).removeClass("selected");
    }
     $(this).addClass("selected")
     lastClickedCell = this;

    if(cellObject.bold){
        $("#bold").addClass("isOn")
    }else{
        $("#bold").removeClass("isOn")
    }
    
    if(cellObject.underline){
        $("#underline").addClass("isOn")
    }else{
        $("#underline").removeClass("isOn")
    }

    if(cellObject.italic){
        $("#italic").addClass("isOn")
    }else{
        $("#italic").removeClass("isOn")
    }

})
$("#grid .cell").on("keyup" ,function(){
    let { RowId } = getRowCol(this);
    let ht = $(this).height();
    $($("#left-col .cell")[RowId]).height(ht);
})

$("#bold").on("click" , function(){
    $(this).toggleClass("isOn");
    let isBold = $(this).hasClass("isOn");
    $("#grid .cell.selected").css("font-weight" , isBold ? "bolder" : "normal");
    let elem = $("#grid .cell.selected");
    let cellObject =getdb(elem);
    cellObject.bold =isBold;
})
$("#underline").on("click" , function(){
    $(this).toggleClass("isOn");
    let isUnderline = $(this).hasClass("isOn");
    $("#grid .cell.selected").css("text-decoration" , isUnderline ? "underline" : "none");
    let elem = $("#grid .cell.selected");
    let cellObject =getdb(elem);
    cellObject.underline =isUnderline;
})
$("#italic").on("click" , function(){
    $(this).toggleClass("isOn");
    let isItalic = $(this).hasClass("isOn");
    $("#grid .cell.selected").css("font-style" , isItalic ? "Italic" : "normal");
    let elem = $("#grid .cell.selected");
    let cellObject =getdb(elem);
    cellObject.italic =isItalic;
})

$("#font-family").on("change" ,function(){
    let fontFamily = $(this).val();
    $("#grid .cell.selected").css("font-family" ,fontFamily);
    let elem = $("#grid .cell.selected");
    let cellObject = getdb(elem);
    cellObject.fontfamily = fontFamily;
})
$("#font-size").on("change" ,function(){
    let fontSize = $(this).val();
    $("#grid .cell.selected").css("font-size" ,fontSize);
    let elem = $("#grid .cell.selected");
    let cellObject = getdb(elem);
    cellObject.fontsize = fontSize;
})
$("#bg-color").on("change" ,function(){
    let bgColor = $(this).val();
    $("#grid .cell.selected").css("background-color" ,bgColor);
    let elem = $("#grid .cell.selected");
    let cellObject = getdb(elem);
    cellObject.bgcolor = bgColor;
})
$("#text-color").on("change" ,function(){
    let textColor = $(this).val();
    $("#grid .cell.selected").css("color" ,textColor);
    let elem = $("#grid .cell.selected");
    let cellObject = getdb(elem);
    cellObject.textcolor = textColor;
})

$("#right").on("click" ,function(){
    $("#grid .cell.selected").css("text-align" , "right");
    let elem = $("#grid .cell.selected");
    let cellObject =getdb(elem);
    cellObject.halign = "right";
})
$("#left").on("click" ,function(){
    $("#grid .cell.selected").css("text-align" , "left");
    let elem = $("#grid .cell.selected");
    let cellObject =getdb(elem);
    cellObject.halign = "left";
})
$("#center").on("click" ,function(){
    $("#grid .cell.selected").css("text-align" , "center");
    let elem = $("#grid .cell.selected");
    let cellObject =getdb(elem);
    cellObject.halign = "center";
})

$("#new").on("click" , function(){
    db= [];
    let allRows = $("#grid").find(".rows");
    for( let i=0;i<allRows.length;i++){
        let rows = [];
        let allCols = $(allRows[i]).find(".cell")
        for(let j=0;j<allCols.length;j++){
            let cell = {
                value : "",
                formula :"",
                bold  :false,
                underline: false,
                italic : false,
                fontfamily : "Arial",
                fontsize   :14,
                textcolor :"black",
                bgcolor   : "white",
                halign   : "left"
            }
            $(allCols[j]).html('');
            $(allCols[j]).css("font-weight" ,cell.bold ? "bolder" : "normal");
            $(allCols[j]).css("text-decoration" ,cell.underline ? "underline" : "none");
            $(allCols[j]).css("font-style" ,cell.italic ? "italic" : "normal");
            $(allCols[j]).css("font-family" ,cell.fontfamily);
            $(allCols[j]).css("font-size" ,cell.fontsize); 
            $(allCols[j]).css("color" ,cell.textcolor);
            $(allCols[j]).css("background-color" ,cell.bgcolor);
            $(allCols[j]).css("text-align", cell.halign);

            rows.push(cell);
        }
        db.push(rows);
    }
    let cellArr =$("#grid .cell");
    $(cellArr[0]).trigger("click");
})
$("#save").on("click" ,async function(){
    let showDialogBox = await dialog.showOpenDialog();
    let filePath = showDialogBox[0];
    if(filePath == undefined){
        console.log("Please Select a File");
        return;
    }
    let jsonData = JSON.stringify(db);
    fs.writeFileSync(filePath,jsonData);
})
$("#open").on("click", async function(){
    let  showDialogBox = await dialog.showOpenDialog();
    let filePath =showDialogBox[0];
    if(filePath == undefined){
        console.log("Please select a file");
        return;
    }
    let buffer = fs.readFileSync(filePath);
    db = JSON.parse(buffer);
    let allRows = $("#grid").find(".rows");
    for( let i=0;i<allRows.length;i++){
        let rows = [];
        let allCols = $(allRows[i]).find(".cell")
        for(let j=0;j<allCols.length;j++){
          let cell =db[i][j];
          $(allCols[j]).html(cell.value);
            $(allCols[j]).css("font-weight" ,cell.bold ? "bolder" : "normal");
            $(allCols[j]).css("text-decoration" ,cell.underline ? "underline" : "none");
            $(allCols[j]).css("font-style" ,cell.italic ? "italic" : "normal");
            $(allCols[j]).css("font-family" ,cell.fontfamily);
            $(allCols[j]).css("font-size" ,cell.fontsize); 
            $(allCols[j]).css("color" ,cell.bgcolor);
            $(allCols[j]).css("background-color" ,cell.bgcolor);
            $(allCols[j]).css("text-align", cell.halign);
        }
    }
})
// ####################################FORMULA STUFF ########################################## //

// ####################################FORMULA STUFF ########################################## //


 function getRowCol(elem){
     let ColId = Number($(elem).attr("c-id"));
     let RowId = Number($(elem).attr("r-id"));
     return {
         ColId,RowId
     }
 }
 function getdb(elem){
     let { ColId , RowId } = getRowCol(elem);
     console.log("insidegetdb "+ColId)
     return db[RowId][ColId];
 }

    function init(){
        db= [];
        let allRows = $("#grid").find(".rows");
        for( let i=0;i<allRows.length;i++){
            let rows = [];
            let allCols = $(allRows[i]).find(".cell")
            for(let j=0;j<allCols.length;j++){
                let cell = {
                    value : "",
                    bold  :false,
                    underline: false,
                    italic : false,
                    fontfamily : "Arial",
                    fontsize   :14,
                    textcolor :"black",
                    bgcolor   : "white",
                    halign   : "left",
                    formula   : ""
                }
                $(allCols[j]).html('');
                $(allCols[j]).css("font-weight" ,cell.bold ? "bolder" : "normal");
                $(allCols[j]).css("text-decoration" ,cell.underline ? "underline" : "none");
                $(allCols[j]).css("font-style" ,cell.italic ? "italic" : "normal");
                $(allCols[j]).css("font-family" ,cell.fontfamily);
                $(allCols[j]).css("font-size" ,cell.fontsize); 
                $(allCols[j]).css("color" ,cell.textcolor);
                $(allCols[j]).css("background-color" ,cell.bgcolor);
                $(allCols[j]).css("text-align", cell.halign);
              

                rows.push(cell);
            }
            db.push(rows);
        }
    }
    init();

})