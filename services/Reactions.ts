import {Collection} from "discord.js";

const reactions = new Collection<RegExp, string>();
reactions.set(/(good|nice) bot/, '👍');
reactions.set(/awesome bot/, '🥰');
reactions.set(/toch,? bot/, '👍');
reactions.set(/(bad|kut|stupid) bot/, '🖕');
reactions.set(/lizard/, '🦎');
reactions.set(/(vampire|vampier)/, ':vampire:');

export function reactToMessage(message) {
    if (!message.content){
        return;
    } 
    
    const messageContent = message.content.toLowerCase();
    
    if (/(wat denk jij|what do you think),? bot/.test(messageContent)){
        const reply = Math.random() > .5 ? '👍' : '👎';
        message.reply(reply);
        return;
    } 
    
    const reaction = reactions.find((v,k) => k.test(messageContent));
    
    if (reaction){
        message.react(reaction);
    }
}
