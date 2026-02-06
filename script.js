document.addEventListener('DOMContentLoaded', () => {
    const gridCells = document.querySelectorAll('.cell');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const currentCenterDisplay = document.getElementById('current-center');

    // The Luo Shu path (cell indices 0-8)
    // 0(SE) 1(S)  2(SW)
    // 3(E)  4(C)  5(W)
    // 6(NE) 7(N)  8(NW)

    // Path: Center -> NW -> W -> NE -> S -> N -> SW -> E -> SE
    const path = [4, 8, 5, 6, 1, 7, 2, 3, 0];

    // Meanings from user drawing
    const starMeanings = {
        1: "การเงิน การงาน",
        2: "เจ็บป่วย",
        3: "ฉ้อฉล หลอกลวง",
        4: "ไหวพริบ ปฏิภาณ",
        5: "อุบัติเหตุ เสียเงิน *",
        6: "โชคลาภ",
        7: "ศัตรู ทะเลาะ อาฆาต",
        8: "ดาวเฮง *",
        9: "ความก้าวหน้า"
    };

    let currentCenterStar = 1;

    function updateGrid(centerStar, direction = 'next') {
        // Calculate stars for each position based on the center star
        for (let i = 0; i < 9; i++) {
            // Formula: The star at path[i] is (centerStar + i)
            let starValue = (centerStar + i);
            while (starValue > 9) starValue -= 9;
            while (starValue < 1) starValue += 9;

            const cellIndex = path[i];
            const cell = document.getElementById(`cell-${cellIndex}`);
            const numberSpan = cell.querySelector('.number');
            const meaningSpan = cell.querySelector('.meaning');

            // Add animation class
            numberSpan.classList.remove('star-flying');
            meaningSpan.classList.remove('star-flying');

            // Trigger reflow
            void numberSpan.offsetWidth;

            // Update value
            numberSpan.textContent = starValue;
            meaningSpan.textContent = starMeanings[starValue] || "";

            numberSpan.classList.add('star-flying');
            meaningSpan.classList.add('star-flying');
        }

        currentCenterDisplay.textContent = centerStar;
    }

    nextBtn.addEventListener('click', () => {
        currentCenterStar = (currentCenterStar % 9) + 1;
        updateGrid(currentCenterStar, 'next');
    });

    prevBtn.addEventListener('click', () => {
        currentCenterStar = currentCenterStar - 1;
        if (currentCenterStar < 1) currentCenterStar = 9;
        updateGrid(currentCenterStar, 'prev');
    });

    // Initial render
    updateGrid(currentCenterStar);
});
