   //first hide the uppercase keyboard
   $("#keyboard-upper-container").hide();
   let sentenceCounter = 0;
   let targetCounter = 0;

   let count = 0;
   let minutes = 0;
   let seconds =0;
   let replay = "";
   let active = false;
   let t;
   let totalSpanElements = "";
    let numberOfChildren;
   var sentences = [
       'ten ate neite ate nee enet ite ate inet ent eate', 
       'Too ato too nOt enot one totA not anot tOO aNot', 
       'oat itain oat tain nate eate tea anne inant nean', 'itant eate anot eat nato inate eat anot tain eat', 
       'nee ene ate ite tent tiet ent ine ene ete'
   ];

    //assigning variables for the first and last sentence / word
    let firstSentence = sentences[sentenceCounter]; 
    let firstLetter = firstSentence[0];
    let lastSentence = sentences[(sentences.length-1)];
    let lastLetter = lastSentence[(lastSentence.length-1)];
    let sentencesLength = sentences.length;

   
   //make sure the document has fully loaded 
   $(document).ready(function(){
       //using the shifted variable as a flag to monitor when the shift was pressed
       let shifted = false;

       //seting the initial display when the page loads
       $("#sentence").html(sentences[0]);

       $("#target-letter").html(sentences[0][0]);
       
       $("#timer").html(minutes + 'm ' + seconds + 's');

       let myTarget = $("#target-letter").html(); 
       let mySentence = $("#sentence").html();

       let numberOfWords = mySentence.split(' ').length;
       console.log(numberOfWords);

        //put each element into a span tag
        var myContents = "";
        for (var i = 0, len = mySentence.length; i < len; i++) {
            myContents += '<span class="char" id="char-' + i + '">' + mySentence[i] + '</span>';
        }

        $("#sentence").html(myContents);

        $("#char-" + targetCounter).css("background-color", "yellow");
       
        console.log(sentenceCounter);
        console.log(targetCounter);
       
       //if a key was pressed down do the following
       $(document).keydown(function(event){

           //check if the key pressed was the shift key
           if (event.which === 16){
   
                 //display the uppercase keyboard
                 $("#keyboard-lower-container").hide();
                 $("#keyboard-upper-container").show();
                 shifted = true; //set shifted flag to true

           //if shift was not pressed then highlight the key that was pressed
           } else if (event.which === 32){
                $("#32").css("background-color", "yellow");
           }           
            else {
               let keyCode = event.which; //same as event.keyCode - grabbing the value
               
               //check if lowercase is displayed                 
               if (!shifted) {
                 // to fit the IDs in index.html A = 65, a = 97;
                 keyCode = keyCode + 32; //adding 32 because the ASCII id values did not seem to match JavaScript values
               }
               
               //finding the id of key pressed and assigning it a background color of yellow
               $(".keys-row").find("#" + keyCode).css("background-color", "yellow");
           }
       });//end of keydown
       
       //if a key was released do the following
       $(document).keyup(function(event){
           
           //check if shift was released
           if (event.which === 16){
               //display the lowercase keyboard
               $("#keyboard-lower-container").show();
               $("#keyboard-upper-container").hide();  
               shifted = false; //set the flag to false
           //if shift was not pressed then highlight the key that was pressed
           } else if (event.which === 32){
                $("#32").css("background-color", "#F5F5F5");
           } else {
               let keyCode = event.which; //same as event.keyCode - grabbing the value

               //check if lowercase is displayed 
               if (!shifted) {
                   // to fit the IDs in index.html. A = 65, a = 97;
                   keyCode = keyCode + 32; //adding 32 because the ASCII id values dont match the JavaScript values
               }

               $(".keyboard-container").find("#" + keyCode).css("background-color", "#F5F5F5");
           }
       });//end of keyup
       
       //this is the timer function that will start then the first character of the first sentence is pressed 
       function start_timer(){
           
           function timer(){
            if(active){
                if (seconds === 59){
                    if (minutes<59){
                        minutes = minutes +1;
                        seconds = 0;
                    } 
                } else {
                    seconds++;
                }
            }
            // Output the result in an element with id="demo"
            $("#timer").html(minutes + "m " + seconds + "s ");  
           }
           
           t = setInterval(timer, 1000);        
       }
       $(document).keypress(function(event){
        //if the user presses the first character in the first sentence then start timer
        if (firstLetter.charCodeAt(0) === event.which && sentenceCounter === 0 && targetCounter === 0){
                active = true;
                start_timer(active);  
        }
           
        let myTarget = $("#target-letter").html(); 
        let p = document.createElement('p');
        
        //if the user presses the correct target character then add a thumbs-up, increment counter, and highlight new target
        if (myTarget.charCodeAt(0) === event.which){
            
            $("#feedback").append(p);

            $("#feedback p").addClass("glyphicon glyphicon-thumbs-up");

            $("#char-" + targetCounter).css("background-color", "white");
            targetCounter++; 
            console.log("targetCounter " + targetCounter);
            let char = $("#char-" + targetCounter).html();
            $("#target-letter").html(char);
            $("#char-" + targetCounter).css("background-color", "yellow");
        }

        //if the user does not press the target character then add a thumbs down
        if (myTarget.charCodeAt(0) != event.which){
            $("<p class='glyphicon glyphicon-thumbs-down'></p>").appendTo("#feedback");
        }           
           
        //if the user presses the last letter of the last sentence then end timer, update WPM, and ask if they want to play again
        if (lastLetter.charCodeAt(0) === event.which && sentenceCounter === (sentencesLength-1) && targetCounter === totalSpanElements){
                            
            let numberOfMistakes = $(".glyphicon-thumbs-down").length;
            let wordsPerMinute = numberOfWords / minutes - 2 * numberOfMistakes;
            $("#words-per-minute").html(wordsPerMinute + " Words Per Minute");
            
            function stop_timer() {
                clearInterval(t);
            }
            
            //this function will ask the user if they want to play again
            function play_again(){            
                setTimeout(function(){
                    replay = prompt('Do you want to play again?');
                                        
                    if(replay === "Yes" || replay === "yes"){
                        console.log("yes");
                        function refresh() {
                            location.reload();
                        }
                        refresh();
                    } else {  
                        $("#feedback").html("Thanks for playing!");        
                    }
                    },3000);
            }
            stop_timer();            
            play_again();
        }
         
        //if the use has type all of the characters correctly in the current sentence then move to the next sentece and update target character
        if (targetCounter === mySentence.length){
            targetCounter = 0;
            sentenceCounter++;
            $("p").remove();

            $("#sentence").html(sentences[sentenceCounter]);

            $("#target-letter").html(sentences[sentenceCounter][targetCounter]);

            let mySentence = $("#sentence").html();
            //let mySentenceArry = mySentence.split('');
            console.log("mySentence " + mySentence);
            
            //put each element into a span tag
            var myContents = "";
            for (var i = 0, len = mySentence.length; i < len; i++) {
                myContents += '<span class="char" id="char-' + i + '">' + mySentence[i] + '</span>';
            }           

            $("#sentence").html(myContents);
            
            totalSpanElements = $(".char").length;
            console.log("totalSpanElements " + totalSpanElements);

            $("#char-" + targetCounter).css("background-color", "yellow");
            
            numberOfChildren = $(".char").length; 
        }
               
        event.preventDefault();


       });//end of keypress
   });//end of document.ready
