document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const currentCenterDisplay = document.getElementById('current-center');
    const rotateBtn = document.getElementById('rotate-btn');

    // Compass label elements
    const compassTop = document.getElementById('compass-top');
    const compassBottom = document.getElementById('compass-bottom');
    const compassLeft = document.getElementById('compass-left');
    const compassRight = document.getElementById('compass-right');
    const compassTopLeft = document.getElementById('compass-top-left');
    const compassTopRight = document.getElementById('compass-top-right');
    const compassBottomLeft = document.getElementById('compass-bottom-left');
    const compassBottomRight = document.getElementById('compass-bottom-right');

    // 8 directions in clockwise order
    const directions = ['S', 'SW', 'W', 'NW', 'N', 'NE', 'E', 'SE'];

    // The flying star path (direction-based)
    const flyingPath = ['C', 'NW', 'W', 'NE', 'S', 'N', 'SW', 'E', 'SE'];

    // Meanings
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
    let currentFacing = 'S';
    let isAnimating = false;

    function getDirectionMapping(facingTop) {
        const idx = directions.indexOf(facingTop);
        const top = directions[idx];
        const topRight = directions[(idx + 1) % 8];
        const right = directions[(idx + 2) % 8];
        const bottomRight = directions[(idx + 3) % 8];
        const bottom = directions[(idx + 4) % 8];
        const bottomLeft = directions[(idx + 5) % 8];
        const left = directions[(idx + 6) % 8];
        const topLeft = directions[(idx + 7) % 8];

        return {
            0: topLeft, 1: top, 2: topRight,
            3: left, 4: 'C', 5: right,
            6: bottomLeft, 7: bottom, 8: bottomRight
        };
    }

    function updateCompassLabels(animate) {
        const mapping = getDirectionMapping(currentFacing);
        const labels = [compassTopLeft, compassTop, compassTopRight,
            compassLeft, null, compassRight,
            compassBottomLeft, compassBottom, compassBottomRight];

        if (animate) {
            // Fade out
            labels.forEach(label => {
                if (label) label.classList.add('fading');
            });

            // Update text after fade out, then fade in
            setTimeout(() => {
                compassTop.textContent = mapping[1];
                compassBottom.textContent = mapping[7];
                compassLeft.textContent = mapping[3];
                compassRight.textContent = mapping[5];
                compassTopLeft.textContent = mapping[0];
                compassTopRight.textContent = mapping[2];
                compassBottomLeft.textContent = mapping[6];
                compassBottomRight.textContent = mapping[8];

                labels.forEach(label => {
                    if (label) label.classList.remove('fading');
                });
            }, 250);
        } else {
            compassTop.textContent = mapping[1];
            compassBottom.textContent = mapping[7];
            compassLeft.textContent = mapping[3];
            compassRight.textContent = mapping[5];
            compassTopLeft.textContent = mapping[0];
            compassTopRight.textContent = mapping[2];
            compassBottomLeft.textContent = mapping[6];
            compassBottomRight.textContent = mapping[8];
        }
    }

    function updateGrid(centerStar, animate) {
        const directionMapping = getDirectionMapping(currentFacing);

        // Build direction -> star value map
        const directionStars = {};
        for (let i = 0; i < flyingPath.length; i++) {
            let starValue = (centerStar + i);
            while (starValue > 9) starValue -= 9;
            while (starValue < 1) starValue += 9;
            directionStars[flyingPath[i]] = starValue;
        }

        if (animate) {
            // Step 1: Fade out all cells with staggered delay
            for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
                const cell = document.getElementById(`cell-${cellIdx}`);
                const numberSpan = cell.querySelector('.number');
                const meaningSpan = cell.querySelector('.meaning');
                const delay = cellIdx * 25; // staggered

                setTimeout(() => {
                    numberSpan.classList.add('fade-out');
                    numberSpan.classList.remove('fade-in', 'star-flying');
                    meaningSpan.classList.add('fade-out');
                    meaningSpan.classList.remove('fade-in', 'star-flying');
                }, delay);
            }

            // Step 2: Update values and fade in
            setTimeout(() => {
                for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
                    const direction = directionMapping[cellIdx];
                    const starValue = directionStars[direction];
                    const cell = document.getElementById(`cell-${cellIdx}`);
                    const numberSpan = cell.querySelector('.number');
                    const meaningSpan = cell.querySelector('.meaning');
                    const delay = cellIdx * 30;

                    setTimeout(() => {
                        numberSpan.textContent = starValue;
                        meaningSpan.textContent = starMeanings[starValue] || "";
                        numberSpan.classList.remove('fade-out');
                        meaningSpan.classList.remove('fade-out');
                        numberSpan.classList.add('fade-in');
                        meaningSpan.classList.add('fade-in');
                    }, delay);
                }

                // Clean up animation classes after completion
                setTimeout(() => {
                    document.querySelectorAll('.number, .meaning').forEach(el => {
                        el.classList.remove('fade-in', 'fade-out');
                    });
                    isAnimating = false;
                }, 9 * 30 + 400);
            }, 9 * 25 + 200);

        } else {
            // No animation (initial load, next/prev)
            for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
                const direction = directionMapping[cellIdx];
                const starValue = directionStars[direction];
                const cell = document.getElementById(`cell-${cellIdx}`);
                const numberSpan = cell.querySelector('.number');
                const meaningSpan = cell.querySelector('.meaning');

                numberSpan.classList.remove('star-flying', 'fade-in', 'fade-out');
                meaningSpan.classList.remove('star-flying', 'fade-in', 'fade-out');
                void numberSpan.offsetWidth;

                numberSpan.textContent = starValue;
                meaningSpan.textContent = starMeanings[starValue] || "";

                numberSpan.classList.add('star-flying');
                meaningSpan.classList.add('star-flying');
            }
        }

        currentCenterDisplay.textContent = centerStar;
    }

    // Rotate button (clockwise)
    rotateBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        const idx = directions.indexOf(currentFacing);
        currentFacing = directions[(idx + 1) % 8];

        updateCompassLabels(true);
        updateGrid(currentCenterStar, true);
    });

    // Next/Prev buttons
    nextBtn.addEventListener('click', () => {
        currentCenterStar = (currentCenterStar % 9) + 1;
        updateGrid(currentCenterStar, false);
    });

    prevBtn.addEventListener('click', () => {
        currentCenterStar = currentCenterStar - 1;
        if (currentCenterStar < 1) currentCenterStar = 9;
        updateGrid(currentCenterStar, false);
    });

    // Initial render (no animation)
    updateCompassLabels(false);
    updateGrid(currentCenterStar, false);
});
