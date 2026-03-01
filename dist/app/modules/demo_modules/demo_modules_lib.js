"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDemoModules = exports.formatDemoModule = void 0;
/**
 * Format demo module for response
 * @param demoModule - The demo module to format
 * @returns Formatted demo module
 */
const formatDemoModule = (demoModule) => {
    return {
        id: demoModule.id,
        name: demoModule.name,
        description: demoModule.description || '',
        createdAt: demoModule.createdAt,
        updatedAt: demoModule.updatedAt
    };
};
exports.formatDemoModule = formatDemoModule;
/**
 * Format multiple demo modules for response
 * @param demoModules - Array of demo modules to format
 * @returns Array of formatted demo modules
 */
const formatDemoModules = (demoModules) => {
    return demoModules.map(exports.formatDemoModule);
};
exports.formatDemoModules = formatDemoModules;
