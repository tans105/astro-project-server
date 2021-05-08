module.exports = {
    parse: (data) => {
        let obj = {}
        try {
            obj = {
                email: data['email'],
                primary: data['primary'],
                secondary: data['secondary'],
                dob: JSON.stringify(data['dob']),
                pob: data['pob'],
                sob: data['sob'],
                tob: JSON.stringify(data['tob']),
                fname: data['fname'],
                questions: data['questions'],
                amount: data['amount'],
                service: data['service'],
                dob_girl: JSON.stringify(data['dob_girl']),
                pob_girl: data['pob_girl'],
                sob_girl: data['sob_girl'],
                tob_girl: JSON.stringify(data['tob_girl']),
                fname_girl: data['fname_girl'],
            }
            obj.success = true;
        } catch (e) {
            obj.success = false;
        }

        return obj;
    }
}