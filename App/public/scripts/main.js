document.getElementById("atsumori-button").onclick = function () {
  db.collection("sample").where("timeLabel", "==", getPlayStatus()).get().then((querySnapshot) => {
    db.collection('sample').doc(querySnapshot.docs[0].id).update({ "count": querySnapshot.docs[0].data().count + 1 });
  });
};


document.getElementById("text-buttonClear").onclick = function () {
  db.collection("sample").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      db.collection('sample').doc(doc.id).update({ "count": 0 });
    });
  });
};

// API読み込み
script = document.createElement('script');
script.src = "//www.youtube.com/iframe_api";
firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore(script, firstScript);

// 動画呼び出し
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytplayer', {
    height: '285',
    width: '480',
    videoId: 'vdxoDyNAoH0'
  });
}

function getPlayStatus() {
  console.log(Math.floor(player.getCurrentTime()));
  return Math.floor(player.getCurrentTime());
}

var atsumoriButtonElement = document.getElementById('atsumori-button');
atsumoriButtonElement.addEventListener('click', getPlayStatus);


var ctx = document.getElementById("myBarChart");

// firestore初期化
var db = firebase.firestore();
// Default
var data = []
var labels = [];
var count = [];
var maxCount = 10;
var config = {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [
      {
        label: '数',
        data: count,
        backgroundColor: "rgba(219,39,91,0.5)"
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: '盛り上がりグラフ'
    },
    animation: {
      duration: 0
    },

    scales: {
      yAxes: [{
        ticks: {
          suggestedMax: maxCount + 10,
          suggestedMin: 0,
          stepSize: 10,
          callback: function (value, index, values) {
            return value
          }
        }
      }]
    },
  }
};

// グラフ作成
var myBarChart = new Chart(ctx, config);

// 初期表示
db.collection("sample").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    data.push(doc.data())
    if (maxCount < doc.data().count) {
      maxCount = doc.data().count;
    }
  });
  // グラフ更新
  myBarChart.update();

});

// 情報が更新された時の処理をセット

db.collection("sample").onSnapshot(function (querySnapshot) {
  labels.length = 0;
  count.length = 0;
  data = []
  querySnapshot.forEach((doc) => {
    data.push(doc.data())
    if (maxCount < doc.data) {
      maxCount = doc.data().count;
    }
  });

  data.sort(function (a, b) {
    if (a.timeLabel < b.timeLabel) {
      return -1;
    } else {
      return 1;
    }
  });

  data.forEach((d) => {
    labels.push(d.timeLabel)
    count.push(d.count)
  })


  myBarChart.update();

});