import { getConnection } from '../database/oracleDB.js';

export const getAllCoffees = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const coffees = await connection.execute('SELECT * FROM employee');

        const data = coffees.rows;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

export const getCoffee = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const coffee = await connection.execute('SELECT * FROM employee WHERE EMPNO = :id', [req.params.id]);

        if (!coffee) return res.status(404).json({ message: 'Coffee not found' });

        const data = coffee.rows;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

export const createCoffee = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const newCoffee = {
            name: req.body.name,
            origin: req.body.origin,
            roastLevel: req.body.roastLevel,
            flavorNotes: req.body.flavorNotes
        };

        await connection.execute('INSERT INTO coffees (name, origin, roastLevel, flavorNotes) VALUES (:name, :origin, :roastLevel, :flavorNotes)', newCoffee);

        res.status(201).json(newCoffee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

export const updateCoffee = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const updatedCoffee = {
            id: req.params.id,
            name: req.body.name,
            origin: req.body.origin,
            roastLevel: req.body.roastLevel,
            flavorNotes: req.body.flavorNotes
        };

        await connection.execute('UPDATE coffees SET name = :name, origin = :origin, roastLevel = :roastLevel, flavorNotes = :flavorNotes WHERE id = :id', updatedCoffee);

        res.status(200).json(updatedCoffee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

export const deleteCoffee = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const deletedCoffee = await connection.execute('DELETE FROM coffees WHERE id = :id', [req.params.id]);

        if (!deletedCoffee) return res.status(404).json({ message: 'Coffee not found' });

        res.status(200).json({ message: 'Coffee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

export const deleteAllCoffees = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        await connection.execute('DELETE FROM coffees');

        res.status(200).json({ message: 'All coffees deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};