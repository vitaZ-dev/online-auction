/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LogoProps {
  onClick?: () => void;
}

export interface CommonButtonProps {
  text?: string;
  btnType: "small" | "medium" | "large";
  bgColor?: string;
  textColor?: string;
  onClick: VoidFunction;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface CommonCheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  text: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

export interface CommonInputProps {
  id?: string;
  length?: string;
  min?: number;
  maxLength?: number;
  disabled?: boolean;
  type: string;
  placeholder?: string;
  value: string | number;
  setValue: React.ChangeEventHandler<HTMLInputElement>;
}

export interface CommonTextareaProps {
  id?: string;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
  value: string;
  setValue: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export interface CommonModalProps {
  isOpen: boolean;
  setDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  modalTitle?: string;
  children?: React.ReactNode;
  showFooter?: boolean;
  handleModalOk?: () => void;
  handleModalCancel?: () => void;
}

export interface CommonRadioBtnProps {
  id: string;
  text: string;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  checked: boolean;
}

export interface MUIPaginationProps {
  totalPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface CommonCategoryBadgeProps {
  categoryID: number;
}

export interface CommonListProps {
  grid?: number;
  loading?: boolean;
  children?: React.ReactNode;
}

export interface CommonListItemProps {
  src: string;
  category: string;
  title: string;
  startPrice: string | number;
  isOpen?: boolean;
}

export interface CommonTitleProps {
  type: number;
  title: string;
  isOpen?: boolean;
  link?: string | false;
  linkProps?: object;
  linkTitle?: string;
}

export interface ShowListTableProps {
  tableGrid: number[];
  tableHeader: string[];
  tableHeaderText: string[];
  tableList: any[];
}

export interface FullSizeImageProps {
  src: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
