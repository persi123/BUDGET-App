var Budget=(
    function(){

    
    var Expences=function(id,disc,value){
        this.id=id;
        this.discriptation=disc;
        this.value=value
    }
    var Profit=function(id,disc,value){
        this.id=id;
        this.discriptation=disc;
        this.value=value
    }
    var Data={  
        allData:{
            exp:[],
            pre:[]
        },
        AllTotal:{
            exp:0,
            pre:0
        }
    }
    return{
        AddItems:function(type,disc,val){
            var NewItem,Id;
            if(Data.allData[type].id>0){
                Id=Data.allData[type][Data.allData[type].length].id+1;
            }else{
                Id=0;
            }
            if(type==="inc"){
                   NewItem=new Profit(ID,disc,val)
            }else if(type==="exp"){
                NewItem=new Expences(Id,disc,val)
            }
               Data.allData[type].push(NewItem);

        }
    }
}
)();


var UIcontroller=(
    function(){
    return {
        getData:
        {
            Type:document.querySelector("type").Value,
            Decp:document.querySelector("data").value,
            Value:document.querySelector("value").value,
        },
        AddListItems :function(obj,type){
            var element ,html,newHtml;
            if(type==="inc"){
                html= '<div class="list_block" id="income-%d%"><h3 class="data_discription">%discription%</h3><div class="data_value">%value%</div></div>';
            }else if(type==="exp"){
                html= '<div class="list_block" id="income-%d%"><h3 class="data_discription">%discription%</h3><div class="data_value">%value%</div></div>';
            }
        }
    }
}
)();


var Controller =(
    function (UIC,Budget){
        function SetupEvent(){
            Document.querySelector("check",CtrlAdd);
            document.addEventListener("keypress",function(event){
                if(event.keyCode=="13"||event.which=="13"){
                    CtrlAdd();
                }
            })
        }
        function CtrlAdd(){
            var GetInput =UIC.getData;
            var NewiTEM =  BUDGET.AddItems(GetInput.Type,GetInput.disc,Budget.value)
                    
        }
        return  {
            init:function(){
             SetupEvent()
            }
        }
    }
)(UIcontroller,Budget);

Controller.init();