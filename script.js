const cardWrapper = document.querySelector('.card-wrapper'),
    choosePanel = document.querySelector('.choose-panel');
const stepCapacity = 30;
let step = -1;
let result = [0, 0, 0];
let stage = 0;
let chooseItems = [];
let keyboardCheck = false;

cardWrapper.innerHTML = `<div class = "description">Приветствуем! <br> 
    Запоминайте пиктограммы появляющиеся в этой рамке и попробуйте их восстановить их порядок. <br>
    Выбрать пиктограмму можно кликнув на нее в панели сверху или нажатием клавиш 0-9
    (пиктограммы в виде картинок пронумерованны в соответствии со своим порядком, десятый элемент - клавиша "0")
    </div>`

async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), 
    });
    return await response.json(); 
}

document.addEventListener('keydown', function (event) {
    if (!choosePanel.classList.contains('hide')  || keyboardCheck) {
        switch (event.key) {
            case '1':
                chooseItems[0].click();
                break;
            case '2':
                chooseItems[1].click();
                break;
            case '3':
                chooseItems[2].click();
                break;
            case '4':
                chooseItems[3].click();
                break;
            case '5':
                chooseItems[4].click();
                break;
            case '6':
                chooseItems[5].click();
                break;
            case '7':
                chooseItems[6].click();
                break;
            case '8':
                chooseItems[7].click();
                break;
            case '9':
                chooseItems[8].click();
                break;
            case '0':
                chooseItems[9].click();
                break;
            case 'Enter':
                document.querySelector('button.next').click();
                break;

        }
    }
});


class Card {
    constructor(code, content, color = 'black') {
        this.code = code;
        this.content = content;
        this.color = color;
    }

    createCard() {
        const element = document.createElement('div');
        element.style = `color: ${this.color};`;
        element.classList.add('card');
        element.setAttribute('data-code', `${this.code}`)
        element.innerHTML += this.content;
        return element
    }

    drawCard(card, parent) {
        parent.append(card)
    }

}
const heart = new Card(0, '&#10084;', 'red');
const phone = new Card(1, '&#9742;', 'green');
const star = new Card(2, '&#9733;', 'yellow');
const snowflake = new Card(3, '&#10054;', 'blue');
const brush = new Card(4, '&#128396;', 'brown');
const traffic = new Card(5, '&#10811;', 'rgb(179, 11, 11)');
const reuse = new Card(6, '♻', 'greenyellow');
const mail = new Card(7, '&#9993;', 'rgb(163, 163, 0)');
const atom = new Card(8, '&#9885;', 'purple');
const settings = new Card(9, '&#128736;', 'rgb(85, 85, 193)');


const heartBlack = new Card(0, '&#10084;');
const phoneBlack = new Card(1, '&#9742;');
const starBlack = new Card(2, '&#9733;');
const snowflakeBlack = new Card(3, '&#10054;');
const brushBlack = new Card(4, '&#128396;');
const trafficBlack = new Card(5, '&#10811;', 'black');
const reuseBlack = new Card(6, '♻', 'black');
const mailBlack = new Card(7, '&#9993;', 'black');
const atomBlack = new Card(8, '&#9885;', 'black');
const settingsBlack = new Card(9, '&#128736;', 'black');


const one = new Card(0, '1');
const two = new Card(1, '2');
const three = new Card(2, '3');
const four = new Card(3, '4');
const five = new Card(4, '5');
const six = new Card(5, '6');
const seven = new Card(6, '7');
const eight = new Card(7, '8');
const nine = new Card(8, '9');
const zero = new Card(9, '0');

const cardPool = [
    [one, two, three, four, five, six, seven, eight, nine, zero],
    [heart, phone, star, snowflake, brush, traffic, reuse,mail, atom, settings],
    [heartBlack, phoneBlack, starBlack, snowflakeBlack, brushBlack, trafficBlack, reuseBlack,mailBlack, atomBlack, settingsBlack]
]




function setChoosePanel() {
    cardPool[stage].forEach(item => {
        const card = item.createCard();
        choosePanel.append(card);
        chooseItems.push(card);
        card.addEventListener('click', () => {
            if (card.classList.contains('active')) {
                item.drawCard(card, choosePanel)
                card.classList.remove('active')
            } else if(cardWrapper.childNodes.length < 5) {
                card.classList.add('active')
                item.drawCard(card, cardWrapper);
            }
            if (cardWrapper.childNodes.length == 5) {
                document.querySelector('button.next').removeAttribute('disabled');
                choosePanel.classList.add('hide');
                keyboardCheck = true;

            } else {
                document.querySelector('button.next').setAttribute('disabled', '')
                choosePanel.classList.remove('hide');
                keyboardCheck = false
            }
        })
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


document.querySelector('button.next').addEventListener('click',async (e) => {
    e.target.setAttribute('disabled','')
    step++;
    cardWrapper.childNodes.forEach((card, i) => {
        if (card && step > 0 && (card.getAttribute('data-code')) == steps[step - 1][i]) {
            result[stage] += 1;
            Array.from(cardWrapper.childNodes)[i].classList.add('correct')
        } else if (card && step) {
            Array.from(cardWrapper.childNodes)[i].classList.add('wrong')
        }
    })
    await sleep(2000)
    
    if (step < steps.length / 3) {
        chooseItems = [];
        choosePanel.innerHTML = '';
        setChoosePanel();
        cardWrapper.innerHTML = '';
        choosePanel.classList.add('hide');
        e.target.textContent = 'next';
        e.target.setAttribute('disabled', '');
        steps[step].forEach((iter) => {
            cardPool[stage][iter].drawCard(cardPool[stage][iter].createCard(), cardWrapper);
        })
        setTimeout(() => {
            cardWrapper.innerHTML = '';
            choosePanel.classList.remove('hide');
        }, 750);
        
    } else {
        if (stage < 2) {
            console.log(result)
            stage++;
            step = -1;
            cardWrapper.innerHTML = `<div class = "description">Этап завершен!</div>`
        } else {
            document.querySelector('body').innerHTML = `Поздравляем! Ваш результат: <br> 
            цифры - ${result[0]/stepCapacity*100}% 
            цветные пиктограммы - ${result[1]/stepCapacity*100}% 
            черные пиктограммы - ${result[2]/stepCapacity*100}%`;
            // postData("http://127.0.0.1:3000/results", {
            //     resultDigits: result[0] / stepCapacity * 100,
            //     resultColorPict: result[1] / stepCapacity * 100,
            //     resultPict: result[2] / stepCapacity * 100,
            // }).then((data) => {
            //     console.log(data);
            // });

        }
    }
    if(step) e.target.removeAttribute('disabled')
})

const steps = [
    [7, 9, 2, 4, 6],
    [3, 1, 8, 2, 7],
    [4, 8, 0, 5, 7],
    [2, 6, 8, 3, 5],
    [0, 4, 9, 6, 2],
    [7, 5, 4, 1, 9],
    
    [6, 3, 5, 7, 0],
    [9, 1, 3, 8, 2],
    [5, 9, 2, 4, 6],
    [3, 6, 4, 1, 0],
    [1, 7, 9, 8, 5],
    [6, 4, 2, 0, 9],
    
    [6, 3, 0, 9, 8],
    [4, 7, 5, 0, 1],
    [2, 6, 8, 9, 4],
    [3, 0, 1, 8, 5],
    [9, 4, 0, 6, 7],
    [5, 3, 8, 4, 1]
];


// for (let i = 0; i<10; i++){

// }