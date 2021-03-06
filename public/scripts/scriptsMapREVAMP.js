// Copyright (C) 2011 Mike Sandige and Richard Sandige.  
// 	  Mike Sandige Email:    mike_s_101[ at ]hotmail.com
// 	  Richard Sandige Email: rsandige[ at ]calpoly.edu

// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 2
// as published by the Free Software Foundation; 

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.


// (The text of the license is at the end of this file)

	
var MaxVariableCount=4;							
var VariableNames = new Array("A","B","C","D");	
var Width  = new Array(0,2,2,4,4);				// width of Kmap for each VariableCount
var Height = new Array(0,2,2,2,4);				// height of Kmap for each VariableCount
var BitOrder = new Array(0,1,3,2);				// bits across and down Kmap
var BackgroundColor="white";
var AllowDontCare=false;						// true doesn't guarantee a minimal solution
var DontCare = "X";

// Variables (initialized here)
var VariableCount=4;							//1..4
var TruthTable = new Array();					// truth table structure[row][variable]
var KMap = new Array();							// KMap[across][down]
var FunctionText = "";							// F(ABC)= 
var EquationHighlightColor = "yellow";			
var Heavy = 20;

var Equation = new Array();						// solution results 
for (i=0; i<Math.pow(2,MaxVariableCount); i++)
{
	Equation[i] = new Array();					// for each term in result function
	Equation[i].ButtonUIName = "EQ" + i;		// used to generate HTML IDs
	Equation[i].Expression = "";				// HTML text for term 
	Equation[i].Rect = null;					// 'rect' for term 
	Equation.UsedLength=0;						// # of terms in current result function
}
Equation.UsedLength=1;
Equation[0].Expression="0";

// initialize the truth table and kmap structure for the given number of variables
function InitializeTables(VarCount)
{
	TruthTable = new Array();
	KMap = new Array();							

	VariableCount = VarCount;
	KMap.Width=Width[VariableCount];
	KMap.Height=Height[VariableCount];

	for (i=0; i<Math.pow(2,VariableCount); i++)
	{
		TruthTable[i] = new Array();
		TruthTable[i].Index = i;
		TruthTable[i].Name = i.toString(2);
		TruthTable[i].ButtonUIName = "TT"+TruthTable[i].Name;
		TruthTable[i].TTROWUIName = "TTROW" + TruthTable[i].Name;
		for (j=0; j<Math.pow(2,VariableCount); j++)
		{
			TruthTable[i][j] = new Array();
			TruthTable[i][j].Variable = (i & (1<<(VariableCount-(1+j)))?1:0)?true:false;
			TruthTable[i][j].Name = VariableNames[j];
			TruthTable[i][j].KMapEntry = null;
		}
	}

	KMap.XVariables = KMap.Width/2;
	KMap.YVariables = KMap.Height/2;

	for (w=0; w<KMap.Width; w++)
	{
		KMap[w]=new Array();
		for (h=0; h<KMap.Height; h++)
		{
			KMap[w][h]=new Array();
			KMap[w][h].Value = false;
			mapstr = BinaryString(BitOrder[w],KMap.XVariables) + BinaryString(BitOrder[h],KMap.YVariables);
			mapval = parseInt(mapstr,2);
			KMap[w][h].TruthTableEntry = TruthTable[mapval];
			KMap[w][h].TruthTableEntry.KMapEntry = KMap[w][h];
			KMap[w][h].ButtonUIName = "KM" + KMap[w][h].TruthTableEntry.Name;
			KMap[w][h].TDUIName = "TD" + KMap[w][h].TruthTableEntry.Name;
			KMap[w][h].Covered = false;
			KMap[w][h].Variable = new Array();
			for (i=0; i<VariableCount; i++)
			{
				KMap[w][h].Variable[i] = KMap[w][h].TruthTableEntry[i].Variable;
			}
		}
	}

	FunctionText = "F(";
	for (i=0; i<VariableCount; i++)
	{
		FunctionText += VariableNames[i] + ", ";
	}
	FunctionText = FunctionText.slice(0,FunctionText.length-2)
	FunctionText += ") ";

}

InitializeTables(VariableCount);

// returns a color to use for the backround for a given boolean value 
//    Value is expected to be "1", "0", or "X"
function HighlightColor( Value )
{
	if (Value=="1") return "lightgreen";    //0x00FF00;
	if (Value=="0") return "white"; //~0xFF0000;
	return "gray"; //0x7F7F7F;
}

// returns a color to use for rollover highlighting 
//    Value is expected to be "1", "0", or "X"
function RectHighlightColor( Value )
{
	return EquationHighlightColor;
}

// init code (setup display according to query parameters)
function Load()
{
	if (PageParameter("Variables")=="3")
	{
		ChangeVariableNumber( 3 );
	}
	else if (PageParameter("Variables")=="2")
	{
		ChangeVariableNumber( 2 );
	}
	else if (PageParameter("Variables")=="4")
	{
		ChangeVariableNumber( 4 );
	}
	else 
	{
		ChangeVariableNumber( VariableCount );
	}
	if (PageParameter("DontCare")=="true")
	{
		ToggleDontCare();
	}
}
window.onload = Load;

// constructs a Rect type
function CreateRect( x,y,w,h )
{
	var Obj=new Array();
	Obj.x = x;
	Obj.y = y;
	Obj.w = w;
	Obj.h = h;
	return Obj;
}

// Comparison of two trinary 'boolean' values (a boolean value or don't care)
function Compare( Value1, Value2 )
{
	if ( (Value1 == Value2) || (Value1==DontCare) || (Value2==DontCare) )
	{
		return true;
	}
	else
	{
		return false;
	}
}

// Determines if a Rect with a given value fits on the KMap: it 'fits' if every square of the Rect
// matches (copmares with) the TestValue.
// Assumes top left of Rect is within the KMap.
// Assumes Rect is not larger than KMap
function TestRect( Rect, TestValue )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			var Test = KMap[(Rect.x+dx)%KMap.Width][(Rect.y+dy)%KMap.Height].Value;
			if (!Compare(TestValue,Test))
			{
				return false;
			}
		}
	}
	return true;
}

// Returns true if for every square of the Rect in the KMap, the .Covered flag is set
//    or the value of the square is don't care.
function IsCovered( Rect )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			if (!KMap[(Rect.x+dx)%KMap.Width][(Rect.y+dy)%KMap.Height].Covered) 
			{
				//treat dont care's as already covered
				if (!(KMap[(Rect.x+dx)%KMap.Width][(Rect.y+dy)%KMap.Height].Value==DontCare))
				{
					return false;
				}
			}
		}
	}
	return true;
}

// Sets the .Covered flag for every square of the Rect in the KMap
function Cover( Rect, IsCovered )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			KMap[(Rect.x+dx)%KMap.Width][(Rect.y+dy)%KMap.Height].Covered = IsCovered;
		}
	}
}

// Tries every x,y location in the KMap to see if the given rect size (w,h) will fit there
//   (matches in value).  For each location that fits, creates a rect and adds it to the Found 
//   array.  If DoCover is true, also sets the KMap .Cover flag for the rects that fit.
function SearchRect( w,h, TestValue, Found, DoCover )
{
	if ((w>KMap.Width) || (h>KMap.Height))
	{
		return;  // rect is too large
	}
		
	var x=0;
	var y=0;
	var across = (KMap.Width==w) ?1:KMap.Width;
	var down   = (KMap.Height==h)?1:KMap.Height;
	for (x=0; x<across; x++)
	{
		for (y=0; y<down; y++)
		{
			var Rect = CreateRect(x,y,w,h);
			if (TestRect(Rect,TestValue))
			{
				if (!IsCovered(Rect))
				{
					Found[Found.length]=Rect;
					if (DoCover) Cover(Rect, true);
				}
			}
		}
	}
}

// Iterates through an array of Rects (in order) to determine which of them
//  cover something in the KMap and which don't (because previous ones already
//  have covered enough).  Adds rects that do cover something to the Used array.
function TryRects(Rects,Used)
{
    var j = 0;
    for (j = 0; j < Rects.length; j++)
    {
        var Rect = Rects[j];
        if (TestRect(Rect, true))
        {
            if (!IsCovered(Rect))
            {
                Used[Used.length] = Rect;
                Cover(Rect, true);
            }
        }
    }
}

// Adds the given Weight to every element of the Weights map that corresponds to the Rect.
function AddRectWeight(Weights, Rect, Weight)
{
    var dx = 0;
    var dy = 0;
    for (dx = 0; dx < Rect.w; dx++)
    {
        for (dy = 0; dy < Rect.h; dy++)
        {
            Weights[(Rect.x + dx) % KMap.Width][(Rect.y + dy) % KMap.Height] += Weight;
        }
    }
}


// Retrieves a weight value of a rect, by summing the weight of each square in the Weights
// map that correspond to the Rect
function GetRectWeight(Weights, Rect)
{
    var dx = 0;
    var dy = 0;
    var W = 0;
    for (dx = 0; dx < Rect.w; dx++)
    {
        for (dy = 0; dy < Rect.h; dy++)
        {
            W += Weights[(Rect.x + dx) % KMap.Width][(Rect.y + dy) % KMap.Height];
        }
    }
    return W;
}


// Used for the array sorting function to sort objects by each object's .Weight member 
function SortByWeight(a, b)
{
    if (a.Weight < b.Weight) return -1;
    else if (a.Weight > b.Weight) return 1;
    else return 0;
}

// Returns true if two Rects overlap (share any squares)
function OverlappingRects(R1,R2)
{
    if ( (R1.x+R1.w>R2.x) && 
         ((R2.x+R2.w)>(R1.x)) &&
         (R1.y+R1.h>R2.y) && 
         ((R2.y+R2.h)>(R1.y))
        )
        return true;
    return false;
}

// Sorts a list of Rects that cover squares of the KMap, and returns a minimal
// subset of those Rects that cover the same squares
function FindBestCoverage(Rects,AllRects)
{
    // create a 'Weight' map
    var Weights = new Array();
    for (w = 0; w < KMap.Width; w++)
    {
        Weights[w] = new Array();
        for (h = 0; h < KMap.Height; h++)
        {   // initial weight is 0 if not already covered, high if already covered
            Weights[w][h] = (KMap[w][h].Covered)?Heavy:0;
        }
    }
    // seed the weight map with 1 for every square covered by every Rect
    var i = 0;
    for (i = 0; i < Rects.length; i++)
    {
        AddRectWeight(Weights, Rects[i], 1);
    }

    // generate a set of rects sorted by weight - but  after selecting each minimal
    // weighted rect, re-weight the map for the next selection.  Re-weight by
    // making the squares of the selected Rect very heavy, but reduce the
    // weight of any squares for Rects that overlap the selected Rect.  This has the
    // effect of pushing the rects that duplicate KMap coverage to the back of the list, 
    // while bubbling non-overlapping maximal covering rects to the front.
    var SortedRects = new Array();
    while (Rects.length>0)
    {
        var j=0;
        for (j = 0; j < Rects.length; j++)
        {   // get the weight for the remaining Rects
            Rects[j].Weight = GetRectWeight(Weights, Rects[j]);
        }
        // Sort the array to find a Rect with minimal weight
        Rects.sort(SortByWeight);
        SortedRects.push(Rects[0]);
        if (Rects.length == 1)
        {   // just found the last Rect, break out
            break;
        }
        // Make the weight map very heavy for the selected Rect's squares
        AddRectWeight(Weights, Rects[0], Heavy);
        
        // Reduce the weight for Rects that overlap the selected Rect
        for (j=0; j< Rects.length; j++)
        {
            if (OverlappingRects(Rects[0], Rects[j]))
            {
                AddRectWeight(Weights, Rects[j], -1);
            }
        }
        // continue processing with all the Rects but the first one
        Rects = Rects.slice(1);
    }
    
    // determine which of the sorted array of Rects are actually needed
    TryRects(SortedRects, AllRects);
}
	
//Finds the minimized equation for the current KMap.
function Search()
{
    var Rects = new Array();
    Cover(CreateRect(0, 0, KMap.Width, KMap.Height), false);

    // Find the (larger) rectangles that cover just the quares in the KMap
    //  and search for smaller and smaller rects
    SearchRect(4, 4, true, Rects, true);
    SearchRect(4, 2, true, Rects, true);
    SearchRect(2, 4, true, Rects, true);
    SearchRect(1, 4, true, Rects, true);
    SearchRect(4, 1, true, Rects, true);
    SearchRect(2, 2, true, Rects, true);

    // 2x1 sized rects  - These have to be handled specially in order to find a 
    //  minimized solution.  
    var Rects2x1 = new Array();
    SearchRect(2, 1, true, Rects2x1, false);
    SearchRect(1, 2, true, Rects2x1, false);
    FindBestCoverage(Rects2x1, Rects);

    // add the 1x1 rects
    SearchRect(1, 1, true, Rects, true);

    //check to see if any sets of (necessary) smaller rects fully cover larger ones (if so, the larger one is no longer needed)
    Cover(CreateRect(0, 0, KMap.Width, KMap.Height), false);
    for (i = Rects.length - 1; i >= 0; i--)
    {
        if (IsCovered(Rects[i]))
        {
            Rects[i] = null;
        }
        else
        {
            Cover(Rects[i], true);
        }
    }
	
	ClearEquation();	
	for (i=0;i<Rects.length; i++)
	{
		if (Rects[i]!=null)
		{
			RectToEquation(Rects[i]);
		}
	}
	if (Equation.UsedLength==0)
	{
		Equation.UsedLength=1;
		Equation[0].Expression="0";
		Equation[0].Rect = CreateRect(0,0,KMap.Width,KMap.Height);
	}
}

function ClearEquation()
{
	for (i=0; i<Equation.length; i++)
	{
		Equation[i].Rect	= null;
	}
	Equation.UsedLength=0;
}

// returns true if the rect is entirely within a singel given variable 
function IsConstantVariable( Rect, Variable )
{
	var dx=0;
	var dy=0;
	var topleft = KMap[Rect.x][Rect.y].Variable[Variable];
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			test = KMap[(Rect.x+dx)%KMap.Width][(Rect.y+dy)%KMap.Height].Variable[Variable];
			if (test!=topleft)
			{
				return false;
			}
		}
	}
	return true;
}

// Turns a rectangle into a text minterm (in HTML)
function RectToEquation( Rect )
{
	var Text = "";
	var i=0;
	for (i=0; i<VariableCount; i++)
	{
		if (IsConstantVariable( Rect, i))
		{
		//	Text += VariableNames[i];
		//	if (!KMap[Rect.x][Rect.y].Variable[i])
		//	{
		//		Text += "'";
		//	}
			if (!KMap[Rect.x][Rect.y].Variable[i])
			{
				Text += "<span style='text-decoration: overline'>"+VariableNames[i]+"</span> ";
			}
			else
			{
				Text += VariableNames[i] + " ";
			}
		}
	}
	if (Text.length==0)
	{
		Text="1";
	}
	Equation[Equation.UsedLength].Rect  = Rect;
	Equation[Equation.UsedLength].Expression = Text;
	Equation.UsedLength++;
	
	return Text;
}
	

// turns a boolean into a display value  true->"1"  false->"0"
function DisplayValue( bool )
{
	if (bool==true)
	{
		return "1";
	}
	else if (bool==false)
	{
		return "0";
	}
	else return DontCare;
}

// Turns a number into binary in text (prepends 0's to length 'bits')
function BinaryString( value, bits )
{
	var str = value.toString(2);
	var i=0;
	for (i=0; i<bits; i++)
	{
		if (str.length<bits)
		{
			str = "0" + str;
		}
	}
	return str;
}

// redraws UI (with no highlights)
function UpdateUI()
{
    var i = 0;
    for (i = 0; i < TruthTable.length; i++)
    {
        var Val = DisplayValue(TruthTable[i].KMapEntry.Value);
        //Truth Table
        SetValue(TruthTable[i].ButtonUIName, Val);
        SetBackgroundColor(TruthTable[i].ButtonUIName, HighlightColor(Val));
        SetBackgroundColor(TruthTable[i].TTROWUIName, HighlightColor(Val));
        //KMap
        SetValue(TruthTable[i].KMapEntry.ButtonUIName, Val);
        SetBackgroundColor(TruthTable[i].KMapEntry.ButtonUIName, HighlightColor(Val));
        SetBackgroundColor(TruthTable[i].KMapEntry.TDUIName, HighlightColor(Val));
    }
    SetInnerHTML("EquationDiv", GenerateEquationHTML());
}
	
function ToggleValue( Value )
{
	if (AllowDontCare)
	{
		if (Value==true)
		{
			return DontCare;
		}
		else if (Value==DontCare)
		{
			return false;
		}
		else if (Value==false)
		{
			return true;
		}
	}
	else
	{
		return !Value;
	}
}

function ToggleTTEntry( TTEntry )
{
	TTEntry.KMapEntry.Value = ToggleValue(TTEntry.KMapEntry.Value);
	RefreshUI();
}

function ToggleKMEntry( KMEntry )
{
	KMEntry.Value = ToggleValue(KMEntry.Value);
	RefreshUI();
}

function RefreshUI()
{
	ClearEquation();
	Search();
	UpdateUI();
}

// redraws UI with the given equation highlighted
function SetShowRect( EquationEntry, EquationIndex )
{	
	if (EquationEntry==null)
	{
		UpdateUI();
		return;
	}
	else
	{
	    var ShowRect = EquationEntry.Rect;

	    var dx = 0;
        var dy = 0;
        for (dx = 0; dx < ShowRect.w; dx++)
        {
            for (dy = 0; dy < ShowRect.h; dy++)
            {
                var KMEntry = KMap[(ShowRect.x + dx) % KMap.Width][(ShowRect.y + dy) % KMap.Height];
                var Val = DisplayValue(TruthTable[i].KMapEntry.Value);
                //KMap
                SetBackgroundColor(KMEntry.ButtonUIName, RectHighlightColor(Val));
                SetBackgroundColor(KMEntry.TDUIName, RectHighlightColor(Val));
                //Truth Table
                SetBackgroundColor(KMEntry.TruthTableEntry.ButtonUIName, RectHighlightColor(Val));
                SetBackgroundColor(KMEntry.TruthTableEntry.TTROWUIName, RectHighlightColor(Val));
            }
        }
	}
	SetBackgroundColor(Equation[EquationIndex].ButtonUIName,EquationHighlightColor);
}

function GetElement(Name)
{
	if (document.getElementById)
	{
		return document.getElementById(Name);
	}
	else if (document.all)
	{
		return document.all[Name];
	}
	else if (document.layers)
	{
		//not sure this works in all browsers... element.style would be document.layers[Name];
	}
}

function SetInnerHTML(Name,Text)
{
	GetElement(Name).innerHTML = Text
}

function SetBackgroundColor(Name,Color)
{
	GetElement(Name).style.backgroundColor = Color;
}

function SetValue(Name,Value)
{
	GetElement(Name).value = Value;
}

function GenerateTruthTableHTML()
{
	var Text = "<center><b>Tabela Verdade</b><br></center><table ID=\"TruthTableID\" border=1>";
	{
		Text = Text + "<tr>";
		var i=0;
		for (i=0; i<VariableCount; i++)
		{
			Text = Text + "<th style='padding:20px'>"+VariableNames[i]+"</th>";
		}
		Text = Text + "<th style='padding:20px; min-width:60px'>"+FunctionText+"</th></tr>";
			
		for (i=0; i<TruthTable.length; i++)
		{
			Text += "<tr ID='"+TruthTable[i].TTROWUIName+"'; style='padding:20px'>";  
			var j=0;
			for (j=0; j<VariableCount; j++)
			{
				Text = Text + "<td style='padding:20px'>"+DisplayValue(TruthTable[i][j].Variable)+"</td>";
			}
			Text = Text
				+ "<td><input ID="+TruthTable[i].ButtonUIName +" name="+TruthTable[i].ButtonUIName +" type='button'; style='width:100%; height:60px;'; value='"+DisplayValue(TruthTable[i].KMapEntry.Value)+"'; onClick=ToggleTTEntry(TruthTable["+i+"]); ></td>" 
				+ "</tr>";
		}
	}
	Text = Text + "</table>";
	return Text;
}

function GenerateKarnoMapHTML()
{
	var Text = "<table class='semlinha'><tr><th><center>Mapa de Karnaugh</center></th></tr><tr><td>";
	Text = Text + "<table border=1 cellpadding=0 class='semlinha'>";
	var h,w;
	Text = Text + "<tr><th class='semlinha'></th><th class='semlinha'></th><th style='padding:10px' colspan="+(KMap.Width)+">";
	for (i=0; i<KMap.XVariables; i++)
	{
		Text += VariableNames[i];
	}
	Text += "</th></tr>";
	Text += "<tr>";
	Text += "<th class='semlinha'></th><th class='semlinha'></th>";
	for (i=0; i<KMap.Width; i++)
	{
		Text += "<th style='padding:20px' >"+BinaryString(BitOrder[i],KMap.XVariables)+"</th>";
	}
	Text+="</tr>";
	
	for (h=0; h<KMap.Height; h++)
	{
		Text = Text + "<tr>";
		if (h==0)
		{
			Text += "<th style='padding:10px' rowspan="+(KMap.Height)+">";
			for (i=0; i<KMap.YVariables; i++)
			{
				Text += VariableNames[i+KMap.XVariables];
			}
		}
		Text += "<th style='padding:20px'>"+BinaryString(BitOrder[h],KMap.YVariables)+"</th>";

		for (w=0; w<KMap.Width; w++)
		{
			Text += "<td ID='"+KMap[w][h].TDUIName+"'; style='background-color:0xFF'>"
					+ "<input ID="+KMap[w][h].ButtonUIName +" name="+KMap[w][h].ButtonUIName +" type='button'  value='"+DisplayValue(KMap[w][h].Value)+"'; onClick=ToggleKMEntry(KMap["+w+"]["+h+"]); style='width:100%; height:60px;'>"
					+ "</td>";
		}
		Text += "</tr>";
	}
	Text += "</table>";
	Text+="</td></tr></table>";
	return Text;
}

function GenerateEquationHTML()
{
	var j;
	var Text = "<p><p>";
	var i;
	for (i=0; i<Equation.UsedLength; )
	{
	Text += "<table class='semlinha' style='margin: 0 auto;'>";
	for (j=0; (j<4) && (i<Equation.UsedLength); j++)
	{
		if (i==0) Text+= "<td class='respostas' style='min-width:260px'><b>"+FunctionText + "=</td>";
		if (i==4) Text+= "<td width=75></td>";
		Text += "<td class='respostas' ID="+Equation[i].ButtonUIName;
		Text += " onMouseOver=SetShowRect(Equation["+i+"],"+i+"); onMouseOut=SetShowRect(null); ";
		Text += "><b>" + Equation[i].Expression + "</td>";
		if (i<Equation.UsedLength-1) Text +="<td> + </td>";
		i++;
	}	
	Text+="</table>";
	}
	return Text;
}

function ChangeVariableNumber( Num )
{
	InitializeTables(Num);
	ClearEquation();
	SetInnerHTML("TruthTableDiv",GenerateTruthTableHTML());
	SetInnerHTML("KarnoMapDiv",GenerateKarnoMapHTML());
	SetInnerHTML("EquationDiv",GenerateEquationHTML());
	GetElement("TwoVariableRB").checked   = (Num==2)?true:false;
	GetElement("ThreeVariableRB").checked = (Num==3)?true:false;
	GetElement("FourVariableRB").checked  = (Num==4)?true:false;
	Search();
	UpdateUI();
}

function ToggleDontCare()
{
	AllowDontCare=!AllowDontCare;
	var i=0;
	for (i=0;i<TruthTable.length; i++)
	{
		if (TruthTable[i].KMapEntry.Value==DontCare)
		{
			TruthTable[i].KMapEntry.Value=false;
		}
	}
	ChangeVariableNumber(VariableCount);
	GetElement("AllowDontCareCB").checked = AllowDontCare;
}

function PageParameter( Name )
{
	var Regex = new RegExp( "[\\?&]"+Name+"=([^&#]*)" );
	var Results = Regex.exec( window.location.href );
	if( Results != null )
	{
		return Results[1];
	}
	return "";
}
	
	
	
//
// 		    GNU GENERAL PUBLIC LICENSE
// 		       Version 2, June 1991

//  Copyright (C) 1989, 1991 Free Software Foundation, Inc.
//                        59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//  Everyone is permitted to copy and distribute verbatim copies
//  of this license document, but changing it is not allowed.

// 			    Preamble

//   The licenses for most software are designed to take away your
// freedom to share and change it.  By contrast, the GNU General Public
// License is intended to guarantee your freedom to share and change free
// software--to make sure the software is free for all its users.  This
// General Public License applies to most of the Free Software
// Foundation's software and to any other program whose authors commit to
// using it.  (Some other Free Software Foundation software is covered by
// the GNU Library General Public License instead.)  You can apply it to
// your programs, too.

//   When we speak of free software, we are referring to freedom, not
// price.  Our General Public Licenses are designed to make sure that you
// have the freedom to distribute copies of free software (and charge for
// this service if you wish), that you receive source code or can get it
// if you want it, that you can change the software or use pieces of it
// in new free programs; and that you know you can do these things.

//   To protect your rights, we need to make restrictions that forbid
// anyone to deny you these rights or to ask you to surrender the rights.
// These restrictions translate to certain responsibilities for you if you
// distribute copies of the software, or if you modify it.

//   For example, if you distribute copies of such a program, whether
// gratis or for a fee, you must give the recipients all the rights that
// you have.  You must make sure that they, too, receive or can get the
// source code.  And you must show them these terms so they know their
// rights.

//   We protect your rights with two steps: (1) copyright the software, and
// (2) offer you this license which gives you legal permission to copy,
// distribute and/or modify the software.

//   Also, for each author's protection and ours, we want to make certain
// that everyone understands that there is no warranty for this free
// software.  If the software is modified by someone else and passed on, we
// want its recipients to know that what they have is not the original, so
// that any problems introduced by others will not reflect on the original
// authors' reputations.

//   Finally, any free program is threatened constantly by software
// patents.  We wish to avoid the danger that redistributors of a free
// program will individually obtain patent licenses, in effect making the
// program proprietary.  To prevent this, we have made it clear that any
// patent must be licensed for everyone's free use or not licensed at all.

//   The precise terms and conditions for copying, distribution and
// modification follow.
// 
// 		    GNU GENERAL PUBLIC LICENSE
//    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

//   0. This License applies to any program or other work which contains
// a notice placed by the copyright holder saying it may be distributed
// under the terms of this General Public License.  The "Program", below,
// refers to any such program or work, and a "work based on the Program"
// means either the Program or any derivative work under copyright law:
// that is to say, a work containing the Program or a portion of it,
// either verbatim or with modifications and/or translated into another
// language.  (Hereinafter, translation is included without limitation in
// the term "modification".)  Each licensee is addressed as "you".

// Activities other than copying, distribution and modification are not
// covered by this License; they are outside its scope.  The act of
// running the Program is not restricted, and the output from the Program
// is covered only if its contents constitute a work based on the
// Program (independent of having been made by running the Program).
// Whether that is true depends on what the Program does.

//   1. You may copy and distribute verbatim copies of the Program's
// source code as you receive it, in any medium, provided that you
// conspicuously and appropriately publish on each copy an appropriate
// copyright notice and disclaimer of warranty; keep intact all the
// notices that refer to this License and to the absence of any warranty;
// and give any other recipients of the Program a copy of this License
// along with the Program.

// You may charge a fee for the physical act of transferring a copy, and
// you may at your option offer warranty protection in exchange for a fee.

//   2. You may modify your copy or copies of the Program or any portion
// of it, thus forming a work based on the Program, and copy and
// distribute such modifications or work under the terms of Section 1
// above, provided that you also meet all of these conditions:

//     a) You must cause the modified files to carry prominent notices
//     stating that you changed the files and the date of any change.

//     b) You must cause any work that you distribute or publish, that in
//     whole or in part contains or is derived from the Program or any
//     part thereof, to be licensed as a whole at no charge to all third
//     parties under the terms of this License.

//     c) If the modified program normally reads commands interactively
//     when run, you must cause it, when started running for such
//     interactive use in the most ordinary way, to print or display an
//     announcement including an appropriate copyright notice and a
//     notice that there is no warranty (or else, saying that you provide
//     a warranty) and that users may redistribute the program under
//     these conditions, and telling the user how to view a copy of this
//     License.  (Exception: if the Program itself is interactive but
//     does not normally print such an announcement, your work based on
//     the Program is not required to print an announcement.)
// 
// These requirements apply to the modified work as a whole.  If
// identifiable sections of that work are not derived from the Program,
// and can be reasonably considered independent and separate works in
// themselves, then this License, and its terms, do not apply to those
// sections when you distribute them as separate works.  But when you
// distribute the same sections as part of a whole which is a work based
// on the Program, the distribution of the whole must be on the terms of
// this License, whose permissions for other licensees extend to the
// entire whole, and thus to each and every part regardless of who wrote it.

// Thus, it is not the intent of this section to claim rights or contest
// your rights to work written entirely by you; rather, the intent is to
// exercise the right to control the distribution of derivative or
// collective works based on the Program.

// In addition, mere aggregation of another work not based on the Program
// with the Program (or with a work based on the Program) on a volume of
// a storage or distribution medium does not bring the other work under
// the scope of this License.

//   3. You may copy and distribute the Program (or a work based on it,
// under Section 2) in object code or executable form under the terms of
// Sections 1 and 2 above provided that you also do one of the following:

//     a) Accompany it with the complete corresponding machine-readable
//     source code, which must be distributed under the terms of Sections
//     1 and 2 above on a medium customarily used for software interchange; or,

//     b) Accompany it with a written offer, valid for at least three
//     years, to give any third party, for a charge no more than your
//     cost of physically performing source distribution, a complete
//     machine-readable copy of the corresponding source code, to be
//     distributed under the terms of Sections 1 and 2 above on a medium
//     customarily used for software interchange; or,

//     c) Accompany it with the information you received as to the offer
//     to distribute corresponding source code.  (This alternative is
//     allowed only for noncommercial distribution and only if you
//     received the program in object code or executable form with such
//     an offer, in accord with Subsection b above.)

// The source code for a work means the preferred form of the work for
// making modifications to it.  For an executable work, complete source
// code means all the source code for all modules it contains, plus any
// associated interface definition files, plus the scripts used to
// control compilation and installation of the executable.  However, as a
// special exception, the source code distributed need not include
// anything that is normally distributed (in either source or binary
// form) with the major components (compiler, kernel, and so on) of the
// operating system on which the executable runs, unless that component
// itself accompanies the executable.

// If distribution of executable or object code is made by offering
// access to copy from a designated place, then offering equivalent
// access to copy the source code from the same place counts as
// distribution of the source code, even though third parties are not
// compelled to copy the source along with the object code.
// 
//   4. You may not copy, modify, sublicense, or distribute the Program
// except as expressly provided under this License.  Any attempt
// otherwise to copy, modify, sublicense or distribute the Program is
// void, and will automatically terminate your rights under this License.
// However, parties who have received copies, or rights, from you under
// this License will not have their licenses terminated so long as such
// parties remain in full compliance.

//   5. You are not required to accept this License, since you have not
// signed it.  However, nothing else grants you permission to modify or
// distribute the Program or its derivative works.  These actions are
// prohibited by law if you do not accept this License.  Therefore, by
// modifying or distributing the Program (or any work based on the
// Program), you indicate your acceptance of this License to do so, and
// all its terms and conditions for copying, distributing or modifying
// the Program or works based on it.

//   6. Each time you redistribute the Program (or any work based on the
// Program), the recipient automatically receives a license from the
// original licensor to copy, distribute or modify the Program subject to
// these terms and conditions.  You may not impose any further
// restrictions on the recipients' exercise of the rights granted herein.
// You are not responsible for enforcing compliance by third parties to
// this License.

//   7. If, as a consequence of a court judgment or allegation of patent
// infringement or for any other reason (not limited to patent issues),
// conditions are imposed on you (whether by court order, agreement or
// otherwise) that contradict the conditions of this License, they do not
// excuse you from the conditions of this License.  If you cannot
// distribute so as to satisfy simultaneously your obligations under this
// License and any other pertinent obligations, then as a consequence you
// may not distribute the Program at all.  For example, if a patent
// license would not permit royalty-free redistribution of the Program by
// all those who receive copies directly or indirectly through you, then
// the only way you could satisfy both it and this License would be to
// refrain entirely from distribution of the Program.

// If any portion of this section is held invalid or unenforceable under
// any particular circumstance, the balance of the section is intended to
// apply and the section as a whole is intended to apply in other
// circumstances.

// It is not the purpose of this section to induce you to infringe any
// patents or other property right claims or to contest validity of any
// such claims; this section has the sole purpose of protecting the
// integrity of the free software distribution system, which is
// implemented by public license practices.  Many people have made
// generous contributions to the wide range of software distributed
// through that system in reliance on consistent application of that
// system; it is up to the author/donor to decide if he or she is willing
// to distribute software through any other system and a licensee cannot
// impose that choice.

// This section is intended to make thoroughly clear what is believed to
// be a consequence of the rest of this License.
// 
//   8. If the distribution and/or use of the Program is restricted in
// certain countries either by patents or by copyrighted interfaces, the
// original copyright holder who places the Program under this License
// may add an explicit geographical distribution limitation excluding
// those countries, so that distribution is permitted only in or among
// countries not thus excluded.  In such case, this License incorporates
// the limitation as if written in the body of this License.

//   9. The Free Software Foundation may publish revised and/or new versions
// of the General Public License from time to time.  Such new versions will
// be similar in spirit to the present version, but may differ in detail to
// address new problems or concerns.

// Each version is given a distinguishing version number.  If the Program
// specifies a version number of this License which applies to it and "any
// later version", you have the option of following the terms and conditions
// either of that version or of any later version published by the Free
// Software Foundation.  If the Program does not specify a version number of
// this License, you may choose any version ever published by the Free Software
// Foundation.

//   10. If you wish to incorporate parts of the Program into other free
// programs whose distribution conditions are different, write to the author
// to ask for permission.  For software which is copyrighted by the Free
// Software Foundation, write to the Free Software Foundation; we sometimes
// make exceptions for this.  Our decision will be guided by the two goals
// of preserving the free status of all derivatives of our free software and
// of promoting the sharing and reuse of software generally.

// 			    NO WARRANTY

//   11. BECAUSE THE PROGRAM IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY
// FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW.  EXCEPT WHEN
// OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES
// PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED
// OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.  THE ENTIRE RISK AS
// TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU.  SHOULD THE
// PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING,
// REPAIR OR CORRECTION.

//   12. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
// WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR
// REDISTRIBUTE THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES,
// INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING
// OUT OF THE USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED
// TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY
// YOU OR THIRD PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER
// PROGRAMS), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGES.

// 		     END OF TERMS AND CONDITIONS
// 
// 	    How to Apply These Terms to Your New Programs

//   If you develop a new program, and you want it to be of the greatest
// possible use to the public, the best way to achieve this is to make it
// free software which everyone can redistribute and change under these terms.

//   To do so, attach the following notices to the program.  It is safest
// to attach them to the start of each source file to most effectively
// convey the exclusion of warranty; and each file should have at least
// the "copyright" line and a pointer to where the full notice is found.

//     <one line to give the program's name and a brief idea of what it does.>
//     Copyright (C) <year>  <name of author>

//     This program is free software; you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation; either version 2 of the License, or
//     (at your option) any later version.

//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with this program; if not, write to the Free Software
//     Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA


// Also add information on how to contact you by electronic and paper mail.

// If the program is interactive, make it output a short notice like this
// when it starts in an interactive mode:

//     Gnomovision version 69, Copyright (C) year name of author
//     Gnomovision comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
//     This is free software, and you are welcome to redistribute it
//     under certain conditions; type `show c' for details.

// The hypothetical commands `show w' and `show c' should show the appropriate
// parts of the General Public License.  Of course, the commands you use may
// be called something other than `show w' and `show c'; they could even be
// mouse-clicks or menu items--whatever suits your program.

// You should also get your employer (if you work as a programmer) or your
// school, if any, to sign a "copyright disclaimer" for the program, if
// necessary.  Here is a sample; alter the names:

//   Yoyodyne, Inc., hereby disclaims all copyright interest in the program
//   `Gnomovision' (which makes passes at compilers) written by James Hacker.

//   <signature of Ty Coon>, 1 April 1989
//   Ty Coon, President of Vice

// This General Public License does not permit incorporating your program into
// proprietary programs.  If your program is a subroutine library, you may
// consider it more useful to permit linking proprietary applications with the
// library.  If this is what you want to do, use the GNU Library General
// Public License instead of this License.

