import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// =============================================================================
// BUTTON COMPONENT
// =============================================================================

export const Button = ({
                           children,
                           variant = 'primary',
                           size = 'medium',
                           disabled = false,
                           loading = false,
                           className = '',
                           ...props
                       }) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline: 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
        ghost: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };

    const sizes = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-sm',
        large: 'px-6 py-3 text-base'
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader className="w-4 h-4 animate-spin mr-2" />}
            {children}
        </button>
    );
};

// =============================================================================
// INPUT COMPONENT
// =============================================================================

export const Input = ({
                          label,
                          error,
                          helperText,
                          leftIcon,
                          rightIcon,
                          className = '',
                          ...props
                      }) => {
    const inputClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
        error ? 'border-red-500' : 'border-gray-300'
    } ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`;

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {leftIcon}
                    </div>
                )}
                <input
                    className={inputClasses}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

// =============================================================================
// SELECT COMPONENT
// =============================================================================

export const Select = ({
                           label,
                           error,
                           options = [],
                           placeholder = 'Wybierz opcję',
                           className = '',
                           ...props
                       }) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors appearance-none bg-white ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

// =============================================================================
// CHECKBOX COMPONENT
// =============================================================================

export const Checkbox = ({
                             label,
                             checked,
                             onChange,
                             disabled = false,
                             className = '',
                             ...props
                         }) => {
    return (
        <div className={`flex items-center ${className}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className="sr-only"
                    {...props}
                />
                <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                        checked
                            ? 'bg-green-600 border-green-600'
                            : 'bg-white border-gray-300 hover:border-green-500'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !disabled && onChange(!checked)}
                >
                    {checked && <Check className="w-3 h-3 text-white" />}
                </div>
            </div>
            {label && (
                <label
                    className={`ml-3 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'} ${
                        !disabled ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => !disabled && onChange(!checked)}
                >
                    {label}
                </label>
            )}
        </div>
    );
};

// =============================================================================
// TOGGLE SWITCH COMPONENT
// =============================================================================

export const Toggle = ({
                           checked,
                           onChange,
                           label,
                           disabled = false,
                           size = 'medium',
                           className = ''
                       }) => {
    const sizes = {
        small: 'h-4 w-8',
        medium: 'h-6 w-11',
        large: 'h-8 w-14'
    };

    const thumbSizes = {
        small: 'h-3 w-3',
        medium: 'h-4 w-4',
        large: 'h-6 w-6'
    };

    const translateX = {
        small: checked ? 'translate-x-4' : 'translate-x-0.5',
        medium: checked ? 'translate-x-6' : 'translate-x-1',
        large: checked ? 'translate-x-7' : 'translate-x-1'
    };

    return (
        <div className={`flex items-center ${className}`}>
            <button
                type="button"
                className={`relative inline-flex ${sizes[size]} flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    checked ? 'bg-green-600' : 'bg-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
            >
        <span
            className={`pointer-events-none inline-block ${thumbSizes[size]} transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${translateX[size]}`}
        />
            </button>
            {label && (
                <span className={`ml-3 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
            )}
        </div>
    );
};

// =============================================================================
// BADGE COMPONENT
// =============================================================================

export const Badge = ({
                          children,
                          variant = 'default',
                          size = 'medium',
                          className = ''
                      }) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';

    const variants = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800'
    };

    const sizes = {
        small: 'px-2 py-0.5 text-xs',
        medium: 'px-2.5 py-0.5 text-sm',
        large: 'px-3 py-1 text-sm'
    };

    return (
        <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
    );
};

// =============================================================================
// ALERT COMPONENT
// =============================================================================

export const Alert = ({
                          children,
                          variant = 'info',
                          title,
                          dismissible = false,
                          onDismiss,
                          className = ''
                      }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const variants = {
        success: {
            container: 'bg-green-50 border-green-200 text-green-800',
            icon: <CheckCircle className="w-5 h-5 text-green-500" />,
            title: 'text-green-800',
            content: 'text-green-700'
        },
        warning: {
            container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
            title: 'text-yellow-800',
            content: 'text-yellow-700'
        },
        error: {
            container: 'bg-red-50 border-red-200 text-red-800',
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
            title: 'text-red-800',
            content: 'text-red-700'
        },
        info: {
            container: 'bg-blue-50 border-blue-200 text-blue-800',
            icon: <Info className="w-5 h-5 text-blue-500" />,
            title: 'text-blue-800',
            content: 'text-blue-700'
        }
    };

    const variantConfig = variants[variant];

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
    };

    return (
        <div className={`border rounded-lg p-4 ${variantConfig.container} ${className}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    {variantConfig.icon}
                </div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className={`text-sm font-medium ${variantConfig.title}`}>
                            {title}
                        </h3>
                    )}
                    <div className={`${title ? 'mt-2' : ''} text-sm ${variantConfig.content}`}>
                        {children}
                    </div>
                </div>
                {dismissible && (
                    <div className="ml-auto pl-3">
                        <button
                            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantConfig.title} hover:bg-opacity-20`}
                            onClick={handleDismiss}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// =============================================================================
// MODAL COMPONENT
// =============================================================================

export const Modal = ({
                          isOpen,
                          onClose,
                          title,
                          children,
                          size = 'medium',
                          className = ''
                      }) => {
    const modalRef = useRef();

    const sizes = {
        small: 'max-w-md',
        medium: 'max-w-lg',
        large: 'max-w-2xl',
        xlarge: 'max-w-4xl'
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={onClose}
                />

                <div
                    ref={modalRef}
                    className={`relative bg-white rounded-lg shadow-xl w-full ${sizes[size]} ${className}`}
                >
                    {title && (
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    )}

                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// DROPDOWN COMPONENT
// =============================================================================

export const Dropdown = ({
                             trigger,
                             children,
                             placement = 'bottom-left',
                             className = ''
                         }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const placements = {
        'bottom-left': 'top-full left-0 mt-1',
        'bottom-right': 'top-full right-0 mt-1',
        'top-left': 'bottom-full left-0 mb-1',
        'top-right': 'bottom-full right-0 mb-1'
    };

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            {isOpen && (
                <div className={`absolute z-50 ${placements[placement]} ${className}`}>
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-48">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export const DropdownItem = ({
                                 children,
                                 onClick,
                                 disabled = false,
                                 className = ''
                             }) => {
    return (
        <button
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
            } ${className}`}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

// =============================================================================
// PROGRESS BAR COMPONENT
// =============================================================================

export const ProgressBar = ({
                                value,
                                max = 100,
                                label,
                                showPercentage = true,
                                variant = 'default',
                                size = 'medium',
                                className = ''
                            }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
        default: 'bg-green-600',
        success: 'bg-green-600',
        warning: 'bg-yellow-500',
        error: 'bg-red-600'
    };

    const sizes = {
        small: 'h-1',
        medium: 'h-2',
        large: 'h-3'
    };

    return (
        <div className={className}>
            {(label || showPercentage) && (
                <div className="flex justify-between items-center mb-1">
                    {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
                    {showPercentage && (
                        <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
                    )}
                </div>
            )}
            <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
                <div
                    className={`${variants[variant]} ${sizes[size]} rounded-full transition-all duration-300 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// =============================================================================
// TOOLTIP COMPONENT
// =============================================================================

export const Tooltip = ({
                            children,
                            content,
                            placement = 'top',
                            className = ''
                        }) => {
    const [isVisible, setIsVisible] = useState(false);

    const placements = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`absolute z-50 ${placements[placement]} ${className}`}>
                    <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
                        {content}
                    </div>
                </div>
            )}
        </div>
    );
};

// =============================================================================
// TABS COMPONENT
// =============================================================================

export const Tabs = ({
                         tabs,
                         activeTab,
                         onTabChange,
                         variant = 'default',
                         className = ''
                     }) => {
    const variants = {
        default: {
            container: 'border-b border-gray-200',
            tab: 'py-2 px-4 text-sm font-medium border-b-2 border-transparent hover:text-green-600 hover:border-green-300',
            activeTab: 'text-green-600 border-green-500'
        },
        pills: {
            container: 'bg-gray-100 p-1 rounded-lg',
            tab: 'py-2 px-4 text-sm font-medium rounded-md hover:bg-gray-200',
            activeTab: 'bg-white text-gray-900 shadow-sm'
        }
    };

    const variantConfig = variants[variant];

    return (
        <div className={className}>
            <div className={`flex ${variantConfig.container}`}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${variantConfig.tab} ${
                            activeTab === tab.id ? variantConfig.activeTab : 'text-gray-500'
                        }`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.icon && <span className="mr-2">{tab.icon}</span>}
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Import missing icon
import { Loader } from 'lucide-react';

export default {
    Button,
    Input,
    Select,
    Checkbox,
    Toggle,
    Badge,
    Alert,
    Modal,
    Dropdown,
    DropdownItem,
    ProgressBar,
    Tooltip,
    Tabs
};