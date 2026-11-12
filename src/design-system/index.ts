/**
 * Groundwork Design System — public API.
 * Application code imports ONLY from "@/design-system" (enforced by ESLint).
 * Component inventory + usage rules: docs/design-system.md and design-system.manifest.json.
 */
export { cx } from './lib/cx';
export { useMediaQuery } from './lib/hooks';
export { tokens, type TokenName } from './tokens/tokens';

export { Button, buttonStyles, type ButtonProps, type ButtonVariant, type ButtonSize } from './components/Button/Button';
export { IconButton, type IconButtonProps } from './components/IconButton/IconButton';
export { Spinner, type SpinnerProps } from './components/Spinner/Spinner';
export { Field, useField, type FieldProps } from './components/Field/Field';
export { Input, Textarea, type InputProps, type TextareaProps } from './components/Input/Input';
export { Select, type SelectProps, type SelectOption } from './components/Select/Select';
export { Checkbox, type CheckboxProps } from './components/Checkbox/Checkbox';
export { Switch, type SwitchProps } from './components/Switch/Switch';
export { SegmentedControl, type SegmentedControlProps, type SegmentOption } from './components/SegmentedControl/SegmentedControl';
export { Menu, MenuItem, MenuSeparator, MenuLabel, type MenuProps, type MenuItemProps } from './components/Menu/Menu';
export { Dialog, type DialogProps } from './components/Dialog/Dialog';
export { Tabs, TabList, Tab, TabPanel, type TabsProps } from './components/Tabs/Tabs';
export { Tooltip, type TooltipProps } from './components/Tooltip/Tooltip';
export { Badge, StatusDot, type BadgeProps, type Tone } from './components/Badge/Badge';
export { Card, CardHeader, type CardProps, type CardHeaderProps } from './components/Card/Card';
export { TableContainer, Table, THead, TBody, TRow, TH, TD, type SortDirection } from './components/Table/Table';
export { ToastProvider, useToast, type ToastOptions } from './components/Toast/Toast';
export { Avatar, initials, type AvatarProps } from './components/Avatar/Avatar';
export { Stepper, type Step, type StepStatus, type StepperProps } from './components/Stepper/Stepper';
export { Alert, EmptyState, Skeleton, Kbd, ProgressBar, type AlertProps, type EmptyStateProps, type ProgressBarProps } from './components/Feedback/Feedback';
