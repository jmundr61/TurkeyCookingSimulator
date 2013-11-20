function DialogueSequence(){

	return {
		next: function(){
			return story.shift().split(": ")[1];
		},
		more: function(){
			return story.length > 0;
		}
	}
}