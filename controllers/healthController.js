/**
 * Health Controller
 * Handles health check and system status endpoints
 */

/**
 * @desc    Get server health status
 * @route   GET /api/health
 * @access  Public
 */
const getHealthStatus = (req, res) => {
    try {
        const healthData = {
            success: true,
            message: 'Server is healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
            }
        };

        res.status(200).json(healthData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Health check failed',
            error: error.message
        });
    }
};

module.exports = {
    getHealthStatus
};
