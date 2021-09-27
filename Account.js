const helpers = require("./helpers");
const Valid = require("./Valid");

const Account = {};

/**
 * Saskaitos irasymas i duombaze.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} userId Vartotojo ID.
 * @returns {Promise<object>} Saskaitos objektas.
 */
Account.create = async (connection, userId) => {
    if (!Valid.id(userId)) {
        return false;
    }

    const accountNumber = 'LT' + helpers.randomInteger(18);

    const query = 'INSERT INTO `accounts`\
                    (`user_id`, `account_number`)\
                    VALUES ("'+ userId + '", "' + accountNumber + '")';
    try {
        const [response] = await connection.execute(query);
        return {
            id: response.insertId,
            accountNumber,
        }
    } catch (error) {
        return error;
    }
}

/**
 * Pinigu inesimas i vartotojo nurodyta saskaita.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {string} accountNumber Vartotojo banko saskaitos numeris.
 * @param {number} cashAmount Inesamos pinigu sumos kiekis (centais).
 * @returns {*}
 */
Account.deposit = async (connection, accountNumber, cashAmount) => {
    if (!Valid.accountNumber(accountNumber) ||
        !Valid.money(cashAmount)) {
        return false;
    }

    const query = 'UPDATE `accounts`\
                    SET `money` = `money` + '+ cashAmount + '\
                    WHERE `account_number` = "' + accountNumber + '"';
    try {
        const [response] = await connection.execute(query);
        if (response.affectedRows === 1 && response.changedRows === 1) {
            return {
                cashAmount,
                accountNumber,
            }
        } else {
            return false;
        }
    } catch (error) {
        return error;
    }
}

module.exports = Account;