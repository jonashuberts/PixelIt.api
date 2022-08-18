module.exports = (connection, log) => {
    return {
        getBMPByID: async (id) => {
            let result;
            try {
                result = await connection.query(`select 
                            a.*, 
                            b.name as username,
                            IFNULL(c.hitcount,0) as hitcount,
                            b.aktiv 
                        from pixel_it_bitmap a 
                        join pixel_it_user b on (a.userid  = b.id)
                        left outer join pixel_it_hitcount c on (a.id = c.pixel_id) 
                        where
                            a.id = ?`, id);
            } catch (error) {
                log.error("getBMPByID: {error}", error);
                return {};
            }

            return result[0];
        },

        getBMPAll: async () => {
            let result;
            try {
                result = await connection.query(`select 
                            a.*, 
                            b.name as username,
                            IFNULL(c.hitcount,0) as hitcount,
                            b.aktiv 
                        from pixel_it_bitmap a 
                        join pixel_it_user b on (a.userid  = b.id)
                        left outer join pixel_it_hitcount c on (a.id = c.pixel_id)`);
            } catch (error) {
                log.error("getBMPAll: {error}", error);
                return {};
            }

            return result[0];
        },

        getBMPNewst: async () => {
            let result;
            try {
                result = await connection.query(`select 
                            a.*, 
                            b.name as username,
                            IFNULL(c.hitcount,0) as hitcount,
                            b.aktiv 
                        from pixel_it_bitmap a 
                        join pixel_it_user b on (a.userid  = b.id)
                        left outer join pixel_it_hitcount c on (a.id = c.pixel_id) 
                        where
                            a.id = (select max(id) from pixel_it_bitmap)`);
            } catch (error) {
                log.error("getBMPNewst: {error}", error);
                return {};
            }

            return result[0];
        },

        saveStats: async () => {
            let result;
            try {

            } catch (error) {
                log.error("saveStats: {error}", error);
                return {};
            }

            return result[0];
        },
    }
};