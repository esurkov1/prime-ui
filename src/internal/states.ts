export const interactionStates = [
  "default",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

export const selectionStates = ["selected", "checked", "indeterminate"] as const;

export const validationStates = ["valid", "invalid", "readonly", "required"] as const;

export const asyncStates = ["idle", "loading", "success", "error"] as const;

export const disclosureStates = ["open", "closed"] as const;

export const componentVariants = {
  button: ["primary", "neutral", "error"] as const,
  input: ["default", "error"] as const,
  textarea: ["default", "error"] as const,
  checkbox: ["default", "error"] as const,
  radio: ["default", "error"] as const,
  switch: ["default", "error"] as const,
  select: ["default", "error"] as const,
  modal: ["default"] as const,
} as const;

export const componentSizes = {
  buttonGroup: ["s", "m", "l", "xl"] as const,
  button: ["s", "m", "l", "xl"] as const,
  input: ["s", "m", "l", "xl"] as const,
  textarea: ["s", "m", "l", "xl"] as const,
  checkbox: ["s", "m", "l", "xl"] as const,
  radio: ["s", "m", "l", "xl"] as const,
  switch: ["s", "m", "l", "xl"] as const,
  select: ["s", "m", "l", "xl"] as const,
  fileUpload: ["s", "m", "l", "xl"] as const,
  linkButton: ["s", "m", "l", "xl"] as const,
  breadcrumb: ["s", "m", "l", "xl"] as const,
  divider: ["s", "m", "l", "xl"] as const,
  label: ["s", "m", "l", "xl"] as const,
  modal: ["s", "m", "l", "xl"] as const,
  hint: ["s", "m", "l", "xl"] as const,
  alert: ["s", "m", "l", "xl"] as const,
  banner: ["s", "m", "l", "xl"] as const,
  digitInput: ["s", "m", "l", "xl"] as const,
  kbd: ["s", "m", "l", "xl"] as const,
  slider: ["s", "m", "l", "xl"] as const,
  tabs: ["s", "m", "l", "xl"] as const,
  pagination: ["s", "m", "l", "xl"] as const,
  stepper: ["s", "m", "l", "xl"] as const,
  accordion: ["s", "m", "l", "xl"] as const,
  dropdown: ["s", "m", "l", "xl"] as const,
  progressBar: ["s", "m", "l", "xl"] as const,
  sidebar: ["s", "m", "l", "xl"] as const,
  drawer: ["s", "m", "l", "xl"] as const,
  dataTable: ["s", "m", "l", "xl"] as const,
} as const;

export const buttonModes = ["filled", "stroke", "lighter", "ghost", "fancy"] as const;

export type InteractionState = (typeof interactionStates)[number];
export type SelectionState = (typeof selectionStates)[number];
export type ValidationState = (typeof validationStates)[number];
export type AsyncState = (typeof asyncStates)[number];
export type DisclosureState = (typeof disclosureStates)[number];

export type ButtonVariant = (typeof componentVariants.button)[number];
export type InputVariant = (typeof componentVariants.input)[number];
export type TextareaVariant = (typeof componentVariants.textarea)[number];
export type CheckboxVariant = (typeof componentVariants.checkbox)[number];
export type RadioVariant = (typeof componentVariants.radio)[number];
export type SwitchVariant = (typeof componentVariants.switch)[number];
export type SelectVariant = (typeof componentVariants.select)[number];
export type ModalVariant = (typeof componentVariants.modal)[number];

export type ButtonGroupSize = (typeof componentSizes.buttonGroup)[number];
export type ButtonSize = (typeof componentSizes.button)[number];
export type InputSize = (typeof componentSizes.input)[number];
export type TextareaSize = (typeof componentSizes.textarea)[number];
export type CheckboxSize = (typeof componentSizes.checkbox)[number];
export type RadioSize = (typeof componentSizes.radio)[number];
export type SwitchSize = (typeof componentSizes.switch)[number];
export type SelectSize = (typeof componentSizes.select)[number];
export type FileUploadSize = (typeof componentSizes.fileUpload)[number];
export type LinkButtonSize = (typeof componentSizes.linkButton)[number];
export type BreadcrumbSize = (typeof componentSizes.breadcrumb)[number];
export type DividerSize = (typeof componentSizes.divider)[number];
export type LabelSize = (typeof componentSizes.label)[number];
export type ModalSize = (typeof componentSizes.modal)[number];
export type HintSize = (typeof componentSizes.hint)[number];
export type AlertSize = (typeof componentSizes.alert)[number];
export type BannerSize = (typeof componentSizes.banner)[number];
export type DigitInputSize = (typeof componentSizes.digitInput)[number];
export type KbdSize = (typeof componentSizes.kbd)[number];
export type SliderSize = (typeof componentSizes.slider)[number];
export type TabsSize = (typeof componentSizes.tabs)[number];
export type PaginationSize = (typeof componentSizes.pagination)[number];
export type StepperSize = (typeof componentSizes.stepper)[number];
export type AccordionSize = (typeof componentSizes.accordion)[number];
export type DropdownSize = (typeof componentSizes.dropdown)[number];
export type ProgressBarSize = (typeof componentSizes.progressBar)[number];
export type SidebarSize = (typeof componentSizes.sidebar)[number];
export type DrawerSize = (typeof componentSizes.drawer)[number];
export type DataTableSize = (typeof componentSizes.dataTable)[number];
export type ButtonMode = (typeof buttonModes)[number];
