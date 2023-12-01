import { createModal } from "../../helpers/manageModal.js";
import { isTodoPassedDeadline, timeTo24, formatExamDueDate, calculateExamDue } from "../../helpers/due.js";
import { openModifyExam } from "./modal-exams.js";


export default function openSAExams(examsArray) {
    const totalExams = examsArray.length;
    const remainingExams = examsArray.filter(
        (exam) => !isTodoPassedDeadline("exam", exam.due.time, exam.due.date)
    );
    const [modal, modalBox] = createModal({
        modalClass: "SA-exams",
        modalIconClass: ["fa-solid", "fa-list-check"],
        modalTitle: "See all Exams",
        modalDescription: "Here you can see all the exams that you have created",
    });
    modal.setAttribute("open", "");

    // Stats (Total/Remaining)
    const examStats = document.createElement("div");
    examStats.classList.add("SA-exams__stats");

    // Total wrapper
    const totalWrapper = document.createElement("div");
    totalWrapper.classList.add("SA-exams__total-exams");
    const totalText = document.createElement("span");
    totalText.classList.add("SA-exams__total-text");
    totalText.textContent = "Total";
    const totalNumber = document.createElement("span");
    totalNumber.classList.add("SA-exams__total-number");
    totalNumber.textContent = totalExams > 99 ? "99+" : totalExams;

    totalWrapper.append(totalText, totalNumber);

    // Divider
    const divider = document.createElement("div");
    divider.classList.add("SA-exams__divider");

    // Remaining
    const remainingWrapper = document.createElement("div");
    remainingWrapper.classList.add("SA-exams__remaining-exams");
    const remainingText = document.createElement("span");
    remainingText.classList.add("SA-exams__remaining-text");
    remainingText.textContent = "Remaining";
    const remainingNumber = document.createElement("span");
    remainingNumber.classList.add("SA-exams__remaining-number");
    remainingNumber.textContent =
        remainingExams.length > 99 ? "99+" : remainingExams.length;
      
    remainingWrapper.append(remainingText, remainingNumber);
    
    examStats.append(totalWrapper, divider, remainingWrapper);

    // All exams wrapper
    const allExams = document.createElement("div");
    allExams.classList.add("SA-exams__cards-wrapper");
    examsArray.forEach(({ id, name, type, result, due }) => {
        const isExamFinished = !remainingExams.find((exam) => exam.id === id);
        const CPDueNumber = isExamFinished ? "-" : calculateExamDue(due.time, due.date);
        const scoreValue = result.grade;
        const guessValue = result.guess;

        // Card Element
        const cardEl = document.createElement("article");
        cardEl.classList.add("SA-exams__exam");
        cardEl.setAttribute("key", `exam-P${id}X`);
        cardEl.addEventListener("click", () =>
            openModifyExam({ id, name, type, result, due })
        );

        // Left
        const cardInfo = document.createElement("div");
        cardInfo.classList.add("SA-exams__card-info");

        // Icon
        const cardIcon = document.createElement("i");
        cardIcon.classList.add("SA-exams__card-icon", "fa-solid", "fa-school");

        // Exam info wrapper
        const examInfoWrapper = document.createElement("div");
        examInfoWrapper.classList.add("SA-exams__exam-info-wrapper");

        // Exam name and type
        const examName = document.createElement("h2");
        examName.classList.add("SA-exams__card-name");
        examName.textContent = `Exam "${name}"`;

        const examType = document.createElement("h2");
        examType.classList.add("SA-exams__card-type");
        examType.textContent = `Type: ${type}`;

        examInfoWrapper.append(examName, examType);

        cardInfo.append(cardIcon, examInfoWrapper);

        // Middle
        const cardProgress = document.createElement("div");
        cardProgress.classList.add("SA-exams__card-progress");

        // Due
        const CPDue = document.createElement("p");
        CPDue.classList.add("SA-exams__card-due");

        // Due output
        const CPDueText = document.createElement("span");
        CPDueText.classList.add("SA-exams__card-due-text");
        CPDueText.textContent = "Due: ";

        CPDue.append(CPDueText, CPDueNumber);
        
        // Guess
        const guess = document.createElement("p");
        guess.classList.add("SA-exams__card-guess");

        // Guess output
        const guessText = document.createElement("span");
        guessText.classList.add("SA-exams__card-guess-text");
        guessText.textContent = "Guess: ";

        guess.append(guessText, guessValue);

        // Done
        const isDone = document.createElement("p");
        isDone.classList.add("SA-exams__card-done");

        // Done output
        const isDoneText = document.createElement("span");
        isDoneText.classList.add("SA-exams__card-done-text");
        isDoneText.textContent = "Done: ";

        const isDoneValue = document.createTextNode(
            `${isExamFinished ? "Yes" : "No"}`
        );

        isDone.append(isDoneText, isDoneValue);

        cardProgress.append(CPDue, guess, isDone);

        // Right
        const cardResult = document.createElement("div");
        cardResult.classList.add("SA-exams__card-result");

        // Score
        const score = document.createElement("p");
        score.classList.add("SA-exams__card-score");

        // Score output
        const scoreText = document.createElement("span");
        scoreText.classList.add("SA-exams__card-score-text");
        scoreText.innerHTML = `Score:<br/>`;

        score.append(scoreText, scoreValue);

        cardResult.append(score);

        cardEl.append(cardInfo, cardProgress, cardResult);
        allExams.appendChild(cardEl);
    });

    modalBox.append(examStats, allExams);
    modal.appendChild(modalBox);
    document.body.appendChild(modal);
}
