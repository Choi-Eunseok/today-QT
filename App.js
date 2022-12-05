import React from 'react';
import { StatusBar, StyleSheet, Text, View, Appearance, TouchableOpacity, Dimensions, Linking, ScrollView, } from 'react-native';
import { DefaultTheme, DarkTheme, } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
const cheerio = require('react-native-cheerio');

const dt = new Date()
const today = dt.getFullYear().toString() + (dt.getMonth() + 1).toString() + dt.getDate().toString() + "1";

class App extends React.Component {
  state = {
    colorScheme: '',
    currTheme: DefaultTheme,
    oBible: [50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4],
    oBibleKo: ['창세기', '출애굽기', '레위기', '민수기', '신명기', '여호수아', '사사기', '룻기', '사무엘상', '사무엘하', '열왕기상', '열왕기하', '역대기상', '역대기하', '에스라', '느헤미야', '에스더', '욥기', '시편', '잠언', '전도서', '아가서', '이사야', '예레미야', '예레미야애가', '에스겔', '다니엘', '호세아', '요엘', '아모스', '오바댜', '요나', '미가', '나훔', '하박국', '스바냐', '학개', '스가랴', '말라기'],
    oBibleEnNum: ['gen', 'exo', 'lev', 'num', 'deu', 'jos', 'jdg', 'rut', '1sa', '2sa', '1ki', '2ki', '1ch', '2ch', 'ezr', 'neh', 'est', 'job', 'psa', 'pro', 'ecc', 'sng', 'isa', 'jer', 'lam', 'ezk', 'dan', 'hos', 'jol', 'amo', 'oba', 'jnh', 'mic', 'nam', 'hab', 'zep', 'hag', 'zec', 'mal'],
    oBibleEnText: ['ge', 'exo', 'lev', 'num', 'deu', 'josh', 'jdgs', 'ruth', '1sm', '2sm', '1ki', '2ki', '1chr', '2chr', 'ezra', 'neh', 'est', 'job', 'psa', 'prv', 'eccl', 'ssol', 'isa', 'jer', 'lam', 'eze', 'dan', 'hos', 'joel', 'amos', 'obad', 'jonah', 'mic', 'nahum', 'hab', 'zep', 'hag', 'zec', 'mal'],
    nBible: [28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 22],
    nBibleKo: ['마태복음', '마가복음', '누가복음', '요한복음', '사도행전', '로마서', '고린도전서', '고린도후서', '갈라디아서', '에베소서', '빌립보서', '골로새서', '데살로니가전서', '데살로니가후서', '디모데전서', '디모데후서', '디도서', '빌레몬서', '히브리서', '야고보서', '베드로전서', '베드로후서', '요한일서', '요한이서', '요한삼서', '유다서', '요한계시록'],
    nBibleEnNum: ['mat', 'mrk', 'luk', 'jhn', 'act', 'rom', '1co', '2co', 'gal', 'eph', 'php', 'col', '1th', '2th', '1ti', '2ti', 'tit', 'phm', 'heb', 'jas', '1pe', '2pe', '1jn', '2jn', '3jn', 'jud', 'rev'],
    nBibleEnText: ['mat', 'mark', 'luke', 'john', 'acts', 'rom', '1cor', '2cor', 'gal', 'eph', 'phi', 'col', '1th', '2th', '1tim', '2tim', 'titus', 'phmn', 'heb', 'jas', '1pet', '2pet', '1jn', '2jn', '3jn', 'jude', 'rev'],
    randBibleKo: '-',
    oldNew: '',
    randIndx: 0,
    randPos: '-',
    source: { html: "" },
  }

  loadBible = (bookNum, bookText, chap) => {
    const numSearchUrl = 'https://www.bskorea.or.kr/bible/getsec.ajax.php?version=GAE&book=' + bookNum + '&chap=' + chap + '&sec=1';
    fetch(numSearchUrl)
      .then((response) => response.text())
      .then((text) => {
        const $ = cheerio.load(text)
        const optionCount = $("option")
        console.log(optionCount.length)
        const bibleSearchUrl = 'https://ibibles.net/quote.php?kor-' + bookText + '/' + chap + ':1-' + optionCount.length
        fetch(bibleSearchUrl)
          .then((response2) => response2.text())
          .then((bibleText) => {
            //console.log(bibleText)
            const source = { html: bibleText.split(this.state.randPos+':').join('') }
            this.setState({ source })
          })
      })
  }

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
  }, 500);
    const colorScheme = Appearance.getColorScheme();
    var currTheme = DefaultTheme;
    if (colorScheme === 'dark') { currTheme = DarkTheme } else { currTheme = DefaultTheme }
    this.setState({ colorScheme, currTheme })
    Appearance.addChangeListener(({ colorScheme }) => {
      colorScheme = Appearance.getColorScheme();
      var currTheme = DefaultTheme;
      if (colorScheme === 'dark') { currTheme = DarkTheme } else { currTheme = DefaultTheme }
      this.setState({ colorScheme, currTheme })
    });
    const oSum = this.state.oBible.reduce((result, number) => result + number);
    console.log(oSum)
    const oKoSum = this.state.oBibleKo.length;
    console.log(oKoSum)
    const nSum = this.state.nBible.reduce((result, number) => result + number);
    console.log(nSum)
    const nKoSum = this.state.nBibleKo.length;
    console.log(nKoSum)
    
    AsyncStorage.getItem("today", (err, result) => {
      if (result == today) {
        const source = { html: '<div style="text-align:center">로딩중</div>' }
        this.setState({ source })
        AsyncStorage.getItem("randNum", (err, result2) => {
          var RandomNumber = parseInt(result2)
          console.log(RandomNumber)
          if (RandomNumber > 929) {
            var randomSector = this.findPos(RandomNumber - 929, 'n')
            const oldNew = 'nt'
            const randBibleKo = this.state.nBibleKo[randomSector[0]]
            const randIndx = randomSector[0]
            const randPos = randomSector[1]
            this.setState({ oldNew, randBibleKo, randIndx, randPos })
            this.loadBible(this.state.nBibleEnNum[randomSector[0]], this.state.nBibleEnText[randomSector[0]], randPos)
          } else {
            var randomSector = this.findPos(RandomNumber, 'o')
            const oldNew = 'ot'
            const randBibleKo = this.state.oBibleKo[randomSector[0]]
            const randIndx = randomSector[0]
            const randPos = randomSector[1]
            this.setState({ oldNew, randBibleKo, randIndx, randPos })
            this.loadBible(this.state.oBibleEnNum[randomSector[0]], this.state.oBibleEnText[randomSector[0]], randPos)
          }
        })
      }
    })
  }

  findPos = (pos, arrType) => {
    var indx = 0
    var currPos = pos
    var arr = []
    if (arrType === 'o') arr = this.state.oBible
    else arr = this.state.nBible
    while (true) {
      if (arr[indx] >= currPos) {
        break
      }
      currPos -= arr[indx]
      indx += 1
    }
    return [indx, currPos]
  }

  randomGenerate = () => {
    
    AsyncStorage.getItem("today", (err, result) => {
      if (result != today) {
        const source = { html: '<div style="text-align:center">로딩중</div>' }
        this.setState({ source })
        var RandomNumber = Math.floor(Math.random() * 1189) + 1; //1189
        AsyncStorage.setItem('today', today)
        console.log("today " + RandomNumber)
        if (RandomNumber > 929) {
          var randomSector = this.findPos(RandomNumber - 929, 'n')
          const oldNew = 'nt'
          const randBibleKo = this.state.nBibleKo[randomSector[0]]
          const randIndx = randomSector[0]
          const randPos = randomSector[1]
          this.setState({ oldNew, randBibleKo, randIndx, randPos })
          this.loadBible(this.state.nBibleEnNum[randomSector[0]], this.state.nBibleEnText[randomSector[0]], randPos)
        } else {
          var randomSector = this.findPos(RandomNumber, 'o')
          const oldNew = 'ot'
          const randBibleKo = this.state.oBibleKo[randomSector[0]]
          const randIndx = randomSector[0]
          const randPos = randomSector[1]
          this.setState({ oldNew, randBibleKo, randIndx, randPos })
          this.loadBible(this.state.oBibleEnNum[randomSector[0]], this.state.oBibleEnText[randomSector[0]], randPos)
        }
        AsyncStorage.setItem('randNum', RandomNumber.toString())
      } else {

      }
    });
  }

  connect = () => {
    Linking.canOpenURL("https://www.churchofjesuschrist.org").then(supported => {
      if (supported) {
        if (this.state.oldNew === 'ot') {
          Linking.openURL("https://www.churchofjesuschrist.org/study/scriptures/" + this.state.oldNew + "/" + this.state.oBibleEn[this.state.randIndx] + "/" + this.state.randPos + "?lang=kor");
        }
        else {
          Linking.openURL("https://www.churchofjesuschrist.org/study/scriptures/" + this.state.oldNew + "/" + this.state.nBibleEn[this.state.randIndx] + "/" + this.state.randPos + "?lang=kor");
        }
      } else {
        console.log("Don't know how to open URI");
      }
    });
  }

  render() {
    var { height, width } = Dimensions.get('window');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: this.state.currTheme.colors.background }}>
        <StatusBar barStyle={this.state.colorScheme === 'dark' ? ('light-content') : ('dark-content')} />
        <TouchableOpacity onPress={this.randomGenerate} style={{ backgroundColor: this.state.currTheme.colors.border, alignItems: 'center', justifyContent: 'center', borderRadius: width * 0.05, padding: height / 50, marginBottom: height / 30 }}>
          <Text style={{ color: this.state.currTheme.colors.text, fontSize: height / 25, fontWeight: 'bold' }}>오늘 큐티</Text>
        </TouchableOpacity>

        <View style={{ width: width, height: height / 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: this.state.currTheme.colors.text, fontSize: height / 20 }}>{this.state.randBibleKo}</Text>
        </View>

        <View style={{ width: width, height: height / 15, alignItems: 'center', justifyContent: 'center', marginBottom: height * 0.02 }}>
          <Text style={{ color: this.state.currTheme.colors.text, fontSize: height / 25 }}>{this.state.randPos}</Text>
        </View>
        <View style={{ width: width * 0.8, height: height * 0.5, }}>
          <ScrollView>
            <RenderHtml
              contentWidth={width * 0.8}
              source={this.state.source}
              tagsStyles={{ body: { color: this.state.currTheme.colors.text, fontSize: height / 50 }, small: { fontSize: height / 40 } }}
            />
          </ScrollView>
        </View>



        {/* {this.state.randBibleKo === '-' ? (
          <View style={{ width: width * 0.2, height: height * 0.04, alignItems: 'center', justifyContent: 'center', borderRadius: width * 0.02, marginTop: height / 40 }} />
        ) : (
          <TouchableOpacity onPress={this.connect} style={{ backgroundColor: this.state.currTheme.colors.primary, width: width * 0.2, height: height * 0.04, alignItems: 'center', justifyContent: 'center', borderRadius: width * 0.02, marginTop: height / 40 }}>
            <Text style={{ color: 'white', fontSize: height * 0.02 }}>연결</Text>
          </TouchableOpacity>
        )} */}

      </View>
    )
  }
}

const styles = StyleSheet.create({

});

export default App;
