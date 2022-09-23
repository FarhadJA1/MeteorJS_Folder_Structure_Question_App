import './home.html'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Random } from 'meteor/random'
Template.currentQuestions.onCreated(function () {
    this.questions = new ReactiveVar([]);
    this.clickedQuestion=new ReactiveVar();
})

Template.currentQuestions.helpers({
    getQuestions() {
        return Template.instance().questions.get();
    },
    getClickedQuestion(){
        return Template.instance().clickedQuestion.get();
    }
    
})
Template.currentQuestions.events({
    'submit #question-form'(e, template) {
        e.preventDefault();
        let currentQuestion = $('#question-add').val();
        let answerContent1 = $('#answer-1').val();
        let answerContent2 = $('#answer-2').val();
        let answerContent3 = $('#answer-3').val();
        let newQuestionId=Random.id()

        let answer1 = {
            id: Random.id(),
            content: answerContent1,
            questionId:newQuestionId
        }
        let answer2 = {
            id: Random.id(),
            content: answerContent2,
            questionId:newQuestionId
        }
        let answer3 = {
            id: Random.id(),
            content: answerContent3,
            questionId:newQuestionId
        }
        let answersArr=[];
        answersArr.push(answer1);
        answersArr.push(answer2);
        answersArr.push(answer3);

        let newQuestion = {
            id: newQuestionId,
            content: currentQuestion, 
            answers:answersArr           
        }
        let arr = template.questions.get();
        arr.push(newQuestion);
        template.questions.set(arr);     
        
        document.querySelector("#question-add").value="";
        document.querySelector("#answer-1").value="";
        document.querySelector("#answer-2").value="";
        document.querySelector("#answer-3").value="";
    },

    'click .remove'(event, template) {
        let questionsArr = template.questions.get();
        questionsArr = questionsArr.filter(x => x.id !== this.id);
        template.questions.set(questionsArr);
    },

    'click .remove-answer'(event, template) { 
         let questionsArr = template.questions.get();
         let filteredArr=[];
         for (let i = 0; i < questionsArr.length; i++) {
            let options = questionsArr[i].answers;
            let currentOption = options.find(m=>m.id===this.id);
            if(currentOption){
                filteredArr=options.filter(m=>m.id!==this.id);
                questionsArr[i].answers=filteredArr;
                break;
            }
         }
        template.questions.set(questionsArr);
    },
    'click .update'(event,template) {        
        let updateForm=$('#update-form');
        updateForm.removeClass('d-none');
        template.clickedQuestion.set(this);
    },
    'submit #update-form'(e,template){        
        e.preventDefault();
        let updatedQuestion = $('#question-update').val();
        let updateAnswerInputs=document.querySelectorAll("#update-answer");

        let questionsArr = template.questions.get();
        let currentQuestion = questionsArr.find(m=> m.id === template.clickedQuestion.get().id);
        currentQuestion.content=updatedQuestion;
        let answersArr=currentQuestion.answers;
        
        for (let i = 0; i < answersArr.length; i++) {            
            for (let j = 0; j < updateAnswerInputs.length; j++) {                
                answersArr[i].content=updateAnswerInputs[j].value;
            }
        }


        currentQuestion.answers=answersArr;
        questionsArr.splice(questionsArr.indexOf(currentQuestion),1,currentQuestion)
        template.questions.set(questionsArr);
        let updateForm=$('#update-form');
        updateForm.addClass('d-none');

        updateAnswerInputs.forEach(input => {
            input.value="";
        });
        updatedQuestion="";

        template.clickedQuestion.set('');
    }
})