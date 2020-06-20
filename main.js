var urlParams = new URLSearchParams(window.location.search);
var gameOn = true;
var time = 0;    

function initGame(){
    var word = "";

    document.querySelector("#ready").addEventListener("click", e=>{
        document.querySelector("#ready").classList.toggle("alt");
        document.querySelector("#word").innerHTML = "..."
        
        time = document.querySelector("#seconds").value * 1
        
        let initTime = time;

        document.querySelector("#stop-timer").classList.remove("alt");
        document.querySelector("#timer").classList.remove("smaller");
        document.querySelector("#timer").innerHTML = "GET READY"
        time += 3;
        gameOn = true;

        let timer = setInterval(function(e){
            if(time > initTime){
                document.querySelector("#timer").innerHTML =  "Now face the screen to the crowd. Starting in: " + (time - initTime)
            }else{
                document.querySelector("#timer").innerHTML = time + " " + (time > 1? "seconds": "second")
                if(!document.querySelector("#timer").classList.contains("larger")){
                    document.querySelector("#timer").classList.add("larger")
                }
                
            }
            
            time--;
            if(time < 0){
                clearInterval(timer);
                document.querySelector("#timer").classList.remove("larger")
                document.querySelector("#start-instructions").classList.remove("hide");
                document.querySelector("#word").innerHTML = word;
                document.querySelector("#timer").innerHTML = "TIMES UP!"
                document.querySelector("#stop-timer").classList.toggle("alt");
                document.querySelector("#start").classList.toggle("alt");
                document.querySelector("main").classList.toggle("red");
                document.querySelectorAll(".tabContainer").forEach(e=>e.classList.remove("hide"))
            }
        }, 1000)

        document.querySelectorAll(".tabContainer").forEach(e=>{
            e.classList.remove("active");
            e.classList.add("hide");
        })
    });

    document.querySelector("#word").addEventListener("click", changeWord)

    document.querySelector("#stop-timer").addEventListener("click", stopTimer)

    document.querySelector("#start").addEventListener("click", e=>{
        gameOn = false;
        document.querySelector("#timer").classList.toggle("smaller");
        document.querySelector("#start-instructions").classList.toggle("hide");
        document.querySelector("#timer").innerHTML = "Read the word above and remember it. Click or tap the word to change it."
        document.querySelector("main").classList.remove("red");
        document.querySelector("#start").classList.toggle("alt");
        document.querySelector("#ready").classList.toggle("alt");
        changeWord();
    });

    document.querySelector("#customWordsTXT").addEventListener("blur", e=>{
        console.log(e.target.value)
        updateFilters(e.target.value)
        document.location.search = "words="+ encodeURI( e.target.value) + "&init=false"
    })
    
    document.querySelectorAll(".tab").forEach(e=>{
        e.addEventListener("click", f=>{ document.querySelector("#"+f.target.dataset.target).classList.toggle("active") });
    })

    document.querySelectorAll(".timerVals").forEach(e=>{
        e.addEventListener("click", f=> { document.querySelector("#seconds").value = f.target.value; });
    })
    
    if(urlParams.has("words")){ 
        document.querySelector("#customWordsTXT").value = decodeURI(urlParams.get("words"))
    }else{
        document.location.search = "words="+ encodeURI( defaultWords.join("\n")) + "&init=true"
        document.querySelector("#customWordsTXT").value = defaultWords.join("\n")
    }

    function changeWord(){
        if(gameOn) return;
        let customWordList = document.querySelector("#customWordsTXT").value
        let customWords = customWordList.split('\n')
        let rand = Math.floor(Math.random()*customWords.length);
        let points = customWords[rand].split(",")[1]

        word = customWords[rand].split(",")[0];
        updateFilters(customWordList);
        document.querySelector("#points").innerHTML = points ?  points + " " + (points > 1? "points" : "point") : "1 point"
        document.querySelector("#word").innerHTML = word;
    }

    function updateFilters(words){
        let categs = []
        let points = []

        //replace with new set based off of custom words
        words.split("\n").forEach(e=>{
            categs.push(e.split(",")[2]);
            points.push(e.split(",")[1]);
        })
        
        let categsUnique =[... new Set(categs)];
        let pointsUnique =[... new Set(points)];

        categsUnique.forEach(e=>{
            createFilters("#cat-filters", e, categs, "filter-", "filter-chk")
        })

        pointsUnique.forEach(e=>{
            createFilters("#points-filters", e, points, "filter-points", "points-filter-chk")
        })

        function createFilters(target,e, arr, pre, classes){
            e = e ? e : "undefined"
            let i = 0;
            let li = document.createElement("li")
            let chk = document.createElement("input")
            let lbl = document.createElement("label")

            chk.type="checkbox";
            chk.class=classes;

            li.appendChild(chk)
            li.appendChild(lbl)

            arr.forEach(f=>{ if(f==e) i++; })
            
            chk.value=e;
            chk.checked = true;
            chk.id= pre+"-"+e;
            lbl.setAttribute("for", chk.id)
            lbl.innerHTML+= e + " (" + i + ")";
            document.querySelector(target).appendChild(li)
        }
    }

    function stopTimer(){ time = 0; }

    updateFilters(document.querySelector("#customWordsTXT").value);
}
window.addEventListener("load", initGame);
