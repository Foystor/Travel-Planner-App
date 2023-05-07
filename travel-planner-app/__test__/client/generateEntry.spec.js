describe('generateEntry', () => {
    test('Alert if information is empty', () => {
        window.alert = jest.fn();

        document.body.innerHTML = `
            <header class="page-header">
                <button>add</button>
            </header>
            <div>
                <input type="text" id="place-input">
                <input type="date" id="date-input">
                <button id="generate">Generate</button>
                <button id="cancel">Cancel</button>
            </div>
            <main class="card-holder"></main>
        `;
        require('../../src/client/js/app');
        document.querySelector('#generate').click();

        expect(window.alert).toHaveBeenCalledTimes(1);
    })
})