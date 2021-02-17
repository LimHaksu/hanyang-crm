const ALPHABET_SIZE = 26;

/**
 * lexoRank 두개를 입력받으면 그 중간에 해당하는 lexoRank 반환
 * @param firstRank
 * @param secondRank
 */
export const getRankBetween = (firstRank: string, secondRank: string) => {
    // 길이 같게 만들기
    while (firstRank.length !== secondRank.length) {
        if (firstRank.length > secondRank.length) {
            secondRank += "a";
        } else {
            firstRank += "a";
        }
    }

    const firstPositioinCodes = firstRank.split("").map((c) => c.charCodeAt(0));
    const secondPositionCodes = secondRank.split("").map((c) => c.charCodeAt(0));

    let difference = 0;

    for (let i = firstPositioinCodes.length - 1; i >= 0; --i) {
        let firstCode = firstPositioinCodes[i];
        let secondCode = secondPositionCodes[i];

        /* 같은 위치의 문자를 계산하는데 secondRank의 문자가 더 작으면
         secondRank에서 firstRank를 뺄 수 없으므로
         한 칸 앞의 문자에서 26을 빌려옴 */
        if (secondCode < firstCode) {
            secondCode += ALPHABET_SIZE;
            secondPositionCodes[i - 1] -= 1;
        }

        // 뒤->앞 순으로 차이 계산
        // difference = a * size^0 + b * size^1 + c * size^2 ...
        const powRes = Math.pow(ALPHABET_SIZE, firstRank.length - 1 - i);
        difference += (secondCode - firstCode) * powRes;
    }

    let newElement = "";
    if (difference <= 1) {
        newElement = firstRank + String.fromCharCode("a".charCodeAt(0) + Math.floor(ALPHABET_SIZE / 2));
    } else {
        difference = Math.floor(difference / 2);

        // 뒤->앞 순으로 중앙값에 해당하는 rank 문자열 구함
        let offset = 0; // 1 or 0. 현재 문자가 z보다 클 경우 다음(왼쪽) 문자로 carry
        for (let i = 0; i < firstRank.length; ++i) {
            // x = difference / (size^place - 1) % size
            const diffInSymbols = Math.floor(difference / Math.pow(ALPHABET_SIZE, i)) % ALPHABET_SIZE;
            let newElementCode = firstRank.charCodeAt(firstRank.length - 1 - i) + diffInSymbols + offset;
            offset = 0;

            // newElementCode가 'z'보다 클 경우
            if (newElementCode > "z".charCodeAt(0)) {
                offset++;
                newElementCode -= ALPHABET_SIZE;
            }

            newElement += String.fromCharCode(newElementCode);
        }
        newElement = newElement.split("").reverse().join("");
    }

    return newElement;
};

/**
 * lexoRank 배열을 만드는 함수, 배열의 길이와 각 rank 문자열의 길이를 입력하면 lexoRank 배열을 만들고 반환한다.
 * @param numOfRows
 * @param defaultRankLength
 */
export const getDefaultRank = (numOfRows: number, defaultRankLength: number) => {
    const startPos = "a".repeat(defaultRankLength);
    const endPos = "z".repeat(defaultRankLength);

    const startCode = startPos.charCodeAt(0);
    const endCode = endPos.charCodeAt(0);
    const diffInOneSymb = endCode - startCode;

    let totalDiff = 0;
    for (let i = 0; i < defaultRankLength; ++i) {
        totalDiff += diffInOneSymb * Math.pow(ALPHABET_SIZE, i);
    }

    const diffForOneItem = Math.floor(totalDiff / numOfRows);
    const diffForSymbols = [];
    for (let i = 0; i < defaultRankLength; ++i) {
        diffForSymbols.push(Math.floor(diffForOneItem / Math.pow(ALPHABET_SIZE, i)) % ALPHABET_SIZE);
    }

    const positions = [];
    let lastAddedElement = startPos;
    for (let rowIdx = 0; rowIdx < numOfRows; ++rowIdx) {
        let offset = 0;
        let newElement = "";
        for (let rankIdx = 0; rankIdx < defaultRankLength; ++rankIdx) {
            const diffInSymbols = diffForSymbols[rankIdx];

            let newElementCode = lastAddedElement.charCodeAt(defaultRankLength - 1 - rankIdx) + diffInSymbols;
            if (offset !== 0) {
                newElementCode += 1;
                offset = 0;
            }

            if (newElementCode > "z".charCodeAt(0)) {
                offset += 1;
                newElementCode -= ALPHABET_SIZE;
            }

            const symbol = String.fromCharCode(newElementCode);
            newElement += symbol;
        }

        positions.push(newElement.split("").reverse().join(""));
        lastAddedElement = newElement;
    }

    positions.sort();
    return positions;
};
