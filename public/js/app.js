(function () {
    const el = {
        output: document.getElementById("output"),
        copyBtn: document.getElementById("copy-btn"),
        refreshBtn: document.getElementById("refresh-btn"),
        passwordControls: document.getElementById("password-controls"),
        passphraseControls: document.getElementById("passphrase-controls"),
        passLength: document.getElementById("pass-length"),
        passLengthValue: document.getElementById("pass-length-value"),
        useUpper: document.getElementById("use-upper"),
        useLower: document.getElementById("use-lower"),
        useNumber: document.getElementById("use-number"),
        useSymbol: document.getElementById("use-symbol"),
        wordCount: document.getElementById("word-count"),
        wordCountValue: document.getElementById("word-count-value"),
        separator: document.getElementById("separator"),
        capitalize: document.getElementById("capitalize"),
        addNumber: document.getElementById("add-number"),
    };

    let passType = "password";
    let dictionaryType = "standard";
    let wordLists = null; // { standard: string[], offensive: string[] }

    async function loadWordLists() {
        const [standardText, offensiveText] = await Promise.all([
            fetch("data/standard-words.txt").then((r) => r.text()),
            fetch("data/offensive-words.txt").then((r) => r.text()),
        ]);
        wordLists = {
            standard: standardText.split(/\r?\n/).filter(Boolean),
            offensive: offensiveText.split(/\r?\n/).filter(Boolean),
        };
    }

    function updatePassword() {
        if (passType === "password") {
            el.output.value = generatePassword({
                passLength: Number(el.passLength.value),
                useUpperChars: el.useUpper.checked,
                useLowerChars: el.useLower.checked,
                useNumberChars: el.useNumber.checked,
                useSymbolChars: el.useSymbol.checked,
            });
        } else {
            const list = dictionaryType === "standard" ? wordLists.standard : wordLists.offensive;
            el.output.value = generatePassphrase(list, {
                numberOfWords: Number(el.wordCount.value),
                capitalize: el.capitalize.checked,
                separatorChar: el.separator.value,
                addNumber: el.addNumber.checked,
            });
        }
    }

    document.querySelectorAll('input[name="pass-type"]').forEach((radio) => {
        radio.addEventListener("change", (e) => {
            passType = e.target.value;
            el.passwordControls.hidden = passType !== "password";
            el.passphraseControls.hidden = passType !== "passphrase";
            updatePassword();
        });
    });

    document.querySelectorAll('input[name="dictionary-type"]').forEach((radio) => {
        radio.addEventListener("change", (e) => {
            dictionaryType = e.target.value;
            updatePassword();
        });
    });

    el.passLength.addEventListener("input", () => {
        el.passLengthValue.textContent = el.passLength.value;
        updatePassword();
    });
    [el.useUpper, el.useLower, el.useNumber, el.useSymbol].forEach((cb) =>
        cb.addEventListener("change", updatePassword)
    );

    el.wordCount.addEventListener("input", () => {
        el.wordCountValue.textContent = el.wordCount.value;
        updatePassword();
    });
    el.separator.addEventListener("input", updatePassword);
    el.capitalize.addEventListener("change", updatePassword);
    el.addNumber.addEventListener("change", updatePassword);

    el.refreshBtn.addEventListener("click", updatePassword);

    el.copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(el.output.value);
            const original = el.copyBtn.textContent;
            el.copyBtn.textContent = "Copied!";
            setTimeout(() => (el.copyBtn.textContent = original), 2000);
        } catch (err) {
            alert(err);
        }
    });

    loadWordLists().then(updatePassword);
})();
