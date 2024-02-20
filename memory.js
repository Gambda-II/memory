class Game {
    numberOfCardsHorizontal = 6;
    numberOfCardsVertical = 4;

    numberOfCards;

    flippedCards = 0;
    openCards = [];

    #numberOfMatches = 0;
    #numberOfTries = 0;


    backImageSources = ['./assets/images/back.jpg'];
    backImagesResources = [];
    frontImagesSources = [
        './assets/images/crescent.jpg', 
        './assets/images/flowers.jpg', 
        './assets/images/fox.jpg', 
        './assets/images/glassBouqet.jpg', 
        './assets/images/pancake.jpg', 
        './assets/images/penguin.jpg', 
        './assets/images/pyjamaCat.jpg', 
        './assets/images/robot.jpg', 
        './assets/images/butterfly.jpg', 
        './assets/images/castle.jpg', 
        './assets/images/tower.jpg', 
        './assets/images/coolCat.jpg', 
        './assets/images/unicorn.jpg',
        './assets/images/chefRat.jpg',
        './assets/images/elefant.jpg',
        './assets/images/polarbear.jpg',
        './assets/images/owl.jpg',
        './assets/images/raven.jpg',
        './assets/images/robotGentleman.jpg',
    ];
    frontImageResources = [];
    cards;

    constructor() {
        this.numberOfCards = this.getTotalNumberOfCards();
        this.cards = [];

        this.setBacksideImageResource();
        this.setFrontsideImageResource();

        this.initCards();
        this.shuffleCards();
    }

    getTotalNumberOfCards() {
        return this.numberOfCardsHorizontal * this.numberOfCardsVertical;
    }

    shuffleCards() {

        let parent = document.querySelector('Gameboard');
        for (var i = parent.children.length; i >= 0; i--) {
            parent.appendChild(parent.children[Math.random() * i | 0]);
        }
    }

    initCards() {
        let index = 0;
        while (index < this.numberOfCards) {

            this.addPairOfCards(index);
            index += 2;
        }
    }

    addPairOfCards(index) {


        let firstIndex = index, secondIndex = index + 1;
        /*
        eigentlich ist es egal, was ich im value speicher
        wenn ich später karten vergleiche, dann kann ich auch schauen, ob firstID = secondID-1
        indem ich floor(firstID / 2) mit floor(secondID / 2) vergleiche
        */
        let value = index;

        let frontImage = this.frontImageResources[index];
        let backImage = this.backImagesResources[0];

        this.cards.push(new Card(firstIndex, value, frontImage, backImage));
        this.cards.push(new Card(secondIndex, value, frontImage, backImage));

        this.addToHTML(index);
    }

    flip(cardElement) {
        
        if (this.flippedCards >= 2)
        return;

        let cardIndex = cardElement.children[0].id;
        let actualCard = this.cards[cardIndex];

        
        
        
        if (!actualCard.isMatched) {
            
            if (!actualCard.isFaceUp) {
                actualCard.flipCard();
                this.flipAnimation(cardElement);
                this.flippedCards++;
                this.openCards.push(cardElement);
                
            }
            else {
                
                return;
            }
        }
        else {
            return;
        }
        
        if (this.flippedCards == 2){

            setTimeout(() => {this.checkCards();},1000);
        }

    }

    checkCards(){
        if (this.flippedCards == 2){

            let firstID = this.openCards[0].id;
            let secondID = this.openCards[1].id;

            if(this.cards[firstID].value == this.cards[secondID].value){

                console.log("found a match");

                this.cards[firstID].foundMatch();
                this.cards[secondID].foundMatch();
                ++this.#numberOfMatches;

                if (this.#numberOfMatches == this.numberOfCards / 2 ){
                    showWinScreen();
                }

                console.log(this.#numberOfMatches);
                console.log(this.numberOfCards);

                this.flippedCards = 0;

                this.openCards.pop();
                this.openCards.pop();
                return;
            }
            else {
                
                this.cards[firstID].flipCard();
                this.cards[secondID].flipCard();
                this.flipAnimation(this.openCards[0]);
                this.flipAnimation(this.openCards[1]);
                this.openCards.pop();
                this.openCards.pop();
                this.flippedCards = 0;
                return;

            }
        }
    }

    flipAnimation(cardElement) {

        
        let actualValue = (Number.parseInt(cardElement.value) + 180) % 360;

        cardElement.value = actualValue;
        let degree = actualValue;
        cardElement.style.transform = `rotateY(${degree}deg)`;

        this.switchVisibility(cardElement);
        setTimeout(() => {this.switchZindex(cardElement);}, 500);
    }

    switchZindex(cardElement){
        let array = Array.from(cardElement.children);
        array.forEach(child => {

            

            if (child.style.zIndex == "1") {
                
                child.style.zIndex = "2";
                return;
            }
            else if (child.style.zIndex == '2') {
                
                child.style.zIndex = "1";
                return;
            }
            else {
                
                return null;
            }
        });
    }

    switchVisibility(cardElement) {
        let array = Array.from(cardElement.children);
        array.forEach(child => {
            let visibilityOptions = ['hidden', 'visible'];
            let activeOption = child.style.visibility;
            if (activeOption == visibilityOptions[0]) {
                child.style.visibility = visibilityOptions[1];
            }
            else if (activeOption == visibilityOptions[1]) {
                child.style.visibility = visibilityOptions[0];
            }
            else {
                return null;
            }
        });
    }

    addToHTML(index) {
        let firstIndex = index, secondIndex = index + 1;
        let normalizedIndex = index / 2;

        const container = document.getElementById('card-container')

        let type = 'button';
        let className = 'memory-card';
        let id;
        let value;
        let firstElementCreated = this.createElementOfType(type, className, id = firstIndex, value = 0);
        let secondElementCreated = this.createElementOfType(type, className, id = secondIndex, value = 0);

        container.appendChild(firstElementCreated);
        container.appendChild(secondElementCreated);


        let randomIndex = Math.floor(Math.random() * this.frontImagesSources.length);
        let source = this.frontImagesSources[randomIndex];
        this.frontImagesSources.splice(randomIndex,1);
        

        let toParent = firstElementCreated;
        let alt;
        let visibility;
        type = 'img';
        this.addChildrenOfTypeToParent(type, id = firstIndex, source, alt = 'front', visibility = 'hidden', toParent);
        toParent = secondElementCreated;
        this.addChildrenOfTypeToParent(type, id = secondIndex, source, alt = 'front', visibility = 'hidden', toParent);

        source = this.backImageSources[0];
        toParent = firstElementCreated;
        this.addChildrenOfTypeToParent(type, firstIndex, source, 'back', 'visible', toParent);
        toParent = secondElementCreated;
        this.addChildrenOfTypeToParent(type, secondIndex, source, 'back', 'visible', toParent);

        let event = 'mousedown';
        let element = firstElementCreated;
        this.addEventListenerToElement(event, element);
        element = secondElementCreated;
        this.addEventListenerToElement(event, element);
    }

    addEventListenerToElement(event, element) {
        let lambda = () => {
            this.flip(element);
        }
        element.addEventListener(event, lambda);
    }

    addChildrenOfTypeToParent(type, id, source, alt, visibility, parent) {
        let childToAdd = document.createElement(type);
        /*
        childToAdd.id = `image-${alt}-${id}`;
        */
        if (alt == 'front') {

            childToAdd.id = id;
            childToAdd.style.zIndex = 1;
        }
        else {
            childToAdd.style.zIndex = 2;
            childToAdd.id = id;
            /*
            childToAdd.id = `image-${alt}-${id}`;
            */
        }
        childToAdd.className = alt;
        childToAdd.src = source;
        childToAdd.alt = alt;
        childToAdd.style.visibility = visibility;

        parent.appendChild(childToAdd);
    }

    createElementOfType(type, className, id, value) {
        let elementToBeCreated = document.createElement(type);
        elementToBeCreated.className = className;
        elementToBeCreated.id = `${id}`;
        elementToBeCreated.value = value;

        if (elementToBeCreated != null) {
            return elementToBeCreated;
        }
        return null;
    }



    loadImage(url) {
        let image = new Image();
        image.src = url;

        image.onload = function () {
            return image;
        }

        image.onerror = function () {
            return null;
        }
    }

    async setBacksideImageResource() {
        let urls = this.backImageSources;

        for (let i = 0; i < urls.length; i++) {

            let url = urls[i];

            try {
                let image = await this.loadImage(url);
                this.backImagesResources.push = image;
            } catch (error) {
                console.error(error);
            }
        }
    }

    async setFrontsideImageResource() {
        let urls = this.frontImagesSources;

        for (let i = 0; i < urls.length; i++) {

            let url = urls[i];

            try {
                let image = await this.loadImage(url);
                this.frontImageResources.push = image;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

class Card {
    id;
    value;

    frontImageURL;
    backImageURL;

    isFaceUp = false;
    isMatched = false;

    constructor(id, value, front, back) {
        this.id = id;
        this.value = value;

        this.frontImageURL = front;
        this.backImageURL = back;
    }

    flipCard() {
        if (this.isMatched) {
            return;
        }
        this.isFaceUp = !this.isFaceUp;
    }

    foundMatch() {
        if (!this.isFaceUp) {
            return;
        }
        this.isMatched = true;
    }

}

function showWinScreen(){
    let winScreen = document.getElementById('winScreen');
    winScreen.style.display = "flex";
    winScreen.style.opacity = 0;

    for(let i = 0 ; i < 200 ; i ++){
        setTimeout(() => {
            winScreen.style.opacity = i/100;
            if(i == 150){
                window.location.reload();
            }
        }, i  * 50 );
    }
}

let game = new Game();