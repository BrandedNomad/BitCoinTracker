const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const axios = require('axios')
const ipc = electron.ipcRenderer;



const notifyBtn = document.getElementById('notifyBtn');
var price = document.querySelector('h1')
var targetPrice = document.getElementById('targetPrice')
var targetPriceVal;

const notification = {
    title:'BTC Alert',
    body:'BTC just beat your target price!',
    icon:path.join(__dirname,'../assets/img/btc.png')
}

const getBTC = () =>{
    //makes request to cryptocompare api
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
        .then(res=>{
            const cryptos = res.data.BTC.USD
            price.innerHTML = '$' + cryptos.toLocaleString('en')

            if(targetPrice.innerHTML !== '' && targetPriceVal < res.data.BTC.USD){

                if(!Notification){
                    console.log('Browser does not support notifications.')
                }else{
                    if(Notification.permission === 'granted'){
                        console.log("Granted")
                        const myNotification = new window.Notification(notification.title,notification)

                    }else{

                        Notification.requestPermission().then((p)=>{
                            if(p === 'granted'){
                                const myNotification = new Notification(notification.title,notification)
                            }else{
                                console.log('User blocked notifications.');
                            }


                        }).catch((error)=>{
                            console.log(error)
                        })
                    }
                }

            }
        })



}

getBTC();
setInterval(getBTC,1000);

notifyBtn.addEventListener('click',(e)=>{
    const modalPath = path.join('file://',__dirname, 'add.html')
    let win = new BrowserWindow({frame:false,transparent:true,alwaysOnTop:true,width:400,height:200,webPreferences:{nodeIntegration:true,enableRemoteModule: true}})
    win.on('close',()=>{
        win=null;
    })
    win.loadURL(modalPath);
    win.show();
})

ipc.on('targetPriceVal',(event,arg)=>{
    targetPriceVal = Number(arg)
    targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en')
})