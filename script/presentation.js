/**
 * Represents a single card in the presentation
 * With a title, text and set of buttons to be selected
 */
class Card {
    /**
     * 
     * @param {String} title 
     * @param {Array<String>} text - An array of paragraphs to describe the card 
     * @param {Array<String>} buttons - ID's of the buttons to be selected
     */
    constructor(title, text, buttons) {
        this.title = title;
        this.text = text;
        this.buttons = buttons;
    }
}

/**
 * Represents a arbitrary presentation
 */
class Presentation {

    /**
     * 
     * @param {Array<Card>} cards 
     * @param {String} titleId - Id to select the title element
     * @param {String} textId - Id to select the text div
     * @param {Function} sideEffects - Function to cause any desired side effects to the document (takes an index for the current card)
     */
    constructor(cards, titleId, textId, sideEffects){
        this.cards = cards;
        this.current = 0;
        this.titleId = titleId;
        this.textId = textId;
        this.sideEffects = sideEffects;
    }

    moveNext() {
        if(this.current >= this.cards.length - 1) {
            return;
        }

        this.current++;
        this.updatePresentation();
    }

    movePrevious() {
        if(this.current <= 0) {
            return;
        }
        this.current--;
        this.updatePresentation();
    }

    updatePresentation() {
        let title = this.cards[this.current].title;
        let paraText = this.cards[this.current].text;
        let buttons = this.cards[this.current].buttons;

        //Update title
        d3.select(this.titleId)
            .text(title);
        //Update text
        let paragraphs = d3.select(this.textId)
            .selectAll('p')
            .data(paraText);

        let paragraphsEnter = paragraphs.enter().append('p');
        paragraphs.exit().remove();
        paragraphs = paragraphs.merge(paragraphsEnter);

        paragraphs.attr('class', 'presentation-text')
            .text((d) => d);

        this.sideEffects(this.current);
    }


}