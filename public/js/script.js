var keylist="1234567890"
var tmp = ""
function generatepass(plength){
	tmp=""
	for(i=0; i<plength; i++){
		tmp+=keylist.charAt(Math.floor(Math.random()*keylist.length))
	}
	return tmp
}
function populateform(enterlength){
	document.passGen.output.value = generatepass(enterlength)
}




// todo section

var add = document.getElementById('add');
var remove = document.getElementById('remove');
var list = document.getElementById('list');


remove.onclick = function() {
	list.innerHTML = '';
}

add.onclick = function(){
	addlist(list);
	document.getElementById('user-input').value = '';
	document.getElementById('user-input').focus();
}

function addlist(targetUl){
	var inputText = document.getElementById('user-input').value;
	var li = document.createElement('li');
	var textNode = document.createTextNode(inputText + '');
	var removeButton = document.createElement('button');

	if (inputText !== '') {
		removeButton.className = 'btn btn-xs btn-danger';
		removeButton.innerHTML = '&times';
		removeButton.setAttribute('onclick', 'removeMe(this)');

		li.appendChild(textNode);
		li.appendChild(removeButton);
		targetUl.appendChild(li);
	}
	else{
		alert("Please enter a TODO");
	}
}

function removeMe(item){
	var p = item.parentElement;
	p.parentElement.removeChild(p);

}


// frnd calculator

function calculatelove(){
	var loveScore = Math.random() * 100;
	loveScore = Math.floor(loveScore) + 1;
	var newName1 = document.getElementById("loveName1").value;
	var newName2 = document.getElementById("loveName2").value;
	document.getElementById("scorelove").innerHTML = newName1 + " You 💝 " + loveScore + "%" + " to " + newName2;
}



//	watch

$(function(){
    var mode = 0;
    var timeCounter = 0;
    var lapCounter = 0;
    var action;
    var lapNumber = 0;
    var timeMinutes, timeSeconds, timeCentiseconds, lapMinutes, lapSeconds, lapCentiseconds;
    
    hideshowButtons("#startButton","#lapButton");
    $("#startButton").click(function(){
        mode = 1;
        hideshowButtons("#stopButton","#lapButton");

        startAction();
    });
    $("#stopButton").click(function(){
        hideshowButtons("#resumeButton","#resetButton");
        clearInterval(action);
    });
    
    $("#resumeButton").click(function(){
        hideshowButtons("#stopButton","#lapButton");
        startAction();
    });
    
    $("#resetButton").click(function(){
        location.reload();
    });
    
    $("#lapButton").click(function(){
        if(mode){
            clearInterval(action);
            lapCounter = 0;
            addLap();
            startAction();
        }
    });

    
    function hideshowButtons(x,y){
        $(".control").hide();
        $(x).show();
        $(y).show();
    }
    
    function startAction(){
        action = setInterval(function(){
            timeCounter++;
            if(timeCounter == 100*60*100){
                timeCounter = 0;   
            }
            lapCounter++;
            if(lapCounter == 100*60*100){
                lapCounter = 0;   
            }
            updateTime();
        },10);
    }
    
    function updateTime(){
        timeMinutes = Math.floor(timeCounter/6000);
        timeSeconds = Math.floor((timeCounter%6000)/100);
        timeCentiseconds = (timeCounter%6000)%100;
        $("#timeminute").text(format(timeMinutes));
        $("#timesecond").text(format(timeSeconds));
        $("#timecentisecond").text(format(timeCentiseconds));

        lapMinutes = Math.floor(lapCounter/6000);
        lapSeconds = Math.floor((lapCounter%6000)/100);
        lapCentiseconds = (lapCounter%6000)%100;
        $("#lapminute").text(format(lapMinutes));
        $("#lapsecond").text(format(lapSeconds));
        $("#lapcentisecond").text(format(lapCentiseconds));
    }
    
    function format(number){
        if(number<10){
            return '0'+number;   
        }else{
            return number;   
        }
    }
    function addLap(){
        lapNumber++;
        var myLapDetails =
        '<div class="lap">'+
        '<div class="laptimetitle">'+
        'Lap'+ lapNumber +
        '</div>'+
        '<div class="laptime">'+
        '<span>'+ format(lapMinutes) +'</span>'+
        ':<span>'+ format(lapSeconds) +'</span>'+
        ':<span>'+ format(lapCentiseconds) +'</span>'+
        '</div>'+
        '</div>';
        $(myLapDetails).prependTo("#laps");
    }
});