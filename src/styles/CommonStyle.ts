import styled from "@emotion/styled";
import {
  CommonButtonType,
  CommonInputType,
  CommonListType,
} from "../types/style";

export const CommonListLayout = styled.div<CommonListType>`
  display: grid;
  grid-template-columns: ${({ grid }) => `repeat(${grid || 2}, 1fr)`};
  column-gap: 15px;
  row-gap: ${({ grid }) => (grid === 2 ? "32px" : "20px")};
  @media (max-width: 475px) {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 16px;
    row-gap: 32px;
  }
  @media (max-width: 280px) {
    grid-template-columns: 1fr;
    column-gap: 8px;
    row-gap: 16px;
  }
  padding: 0 var(--padding-size);

  article {
    padding: 4px 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    cursor: pointer;

    &:hover .img_wrap {
      transform: scale(1.06);
    }

    .post_img {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      &::after {
        content: "";
        display: block;
        padding-bottom: 100%;
      }
      .img_wrap {
        width: 100%;
        height: 100%;
        position: absolute;
        transition: all 0.5s ease;
        aspect-ratio: 1;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
      }

      .closed {
        position: absolute;
        top: 8px;
        left: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1px 5px;
        border-radius: 2px;
        background-color: var(--main-gray-03-color);
        font-size: 11px;
        color: var(--white);
        font-weight: 700;
        line-height: 1.5;
      }
    }

    .post_info {
      width: 100%;
      .category_badge {
        display: inline-block;
        padding: 4px 8px;
        margin-bottom: 4px;
        border-radius: 12px;
        background-color: var(--main-violet-01-color);
        font-size: 12px;
      }
      h5 {
        margin-bottom: 8px;
      }
    }
  }

  .ellipsis {
    &-1 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-2 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const PaginationLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  height: 40px;
`;

// common UI
export const CommonPaddingBox = styled.div`
  padding: 0 16px;
`;

export const CommonNodataBox = styled.div`
  padding: 16px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

// common Component
export const CommonTitleStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 4px var(--padding-size);

  .title_text {
    display: flex;
    align-items: center;
    h1 {
      font-size: 20px;
    }
    h2,
    h3,
    h4 {
      font-size: 18px;
    }
    h5,
    h6 {
      font-size: 16px;
    }
    .title_tag {
    }
    .closed {
      color: var(--main-gray-02-color);
      font-weight: 700;
      margin-right: 4px;
    }
  }
  .link_text {
    display: flex;
    align-items: center;
    font-size: 14px;
    svg {
      font-size: 20px;
    }
    cursor: pointer;
  }
`;

export const CommonModalStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main-modal-dim-color);
  z-index: 999;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, visibility 0.15s ease;

  &.show {
    opacity: 1;
    visibility: visible;
  }

  .modal_wrap {
    margin: 0 auto;
    padding: 10px;
    width: 100%;
    max-width: 640px;
    height: 100%;
  }

  .modal_box {
    position: relative;
    top: 50%;
    left: 50%;
    width: 96%;
    max-width: 500px;
    padding: 16px;
    background: var(--white);
    border-radius: 10px;

    transition: transform 0.3s ease;

    &.hide {
      transform: translate(-50%, 0%);
    }
    &.show {
      transform: translate(-50%, -50%);
    }

    /* @keyframes fadeInUp {
      0% {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
      }
      100% {
        opacity: 1;
        transform: translateZ(0);
      }
    }
    transition: opacity 0.15s linear;
    animation: fadeInUp 0.5s ease-out; */
  }

  .modal_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 20px;
      font-weight: 600;
    }
  }
`;

export const CommonCategoryBadgeStyle = styled.div`
  .category_badge {
    display: inline-block;
    padding: 4px 8px;
    margin-bottom: 4px;
    border-radius: 12px;
    background-color: var(--main-violet-01-color);
    font-size: 12px;
  }
`;

export const CommonInputStyle = styled.div<CommonInputType>`
  input.common-input {
    background: var(--white);
    border: 1px solid var(--main-gray-01-color);
    border-radius: 6px;
    padding: 6px 12px;
    width: ${({ length }) => (length === "full" ? "100%" : "20px")};
    min-width: 140px;
    height: 40px;
    font-size: 14px;
    outline: none;

    &::placeholder {
      color: var(--main-input-placeholder-color);
    }
    &:focus:not(:disabled),
    &:active:not(:disabled) {
      border: 1px solid var(--main-red-color);
      box-shadow: 0 0 0 0.5px var(--main-red-color);
    }

    &:disabled {
      border: 1px solid var(--main-gray-01-color);
      background-color: var(--main-input-bg-color);
      color: var(--main-input-text-color);
    }
  }
`;

export const CommonTextareaStyle = styled.div`
  textarea.common-input {
    width: 100%;
    height: 200px;
    outline: none;
    border: 1px solid var(--main-gray-01-color);
    border-radius: 5px;
    padding: 8px 12px;
    font-weight: 400;
    color: var(--black);
    resize: none;

    &::placeholder {
      color: var(--main-input-placeholder-color);
    }
    &:focus:not(:disabled),
    &:active:not(:disabled) {
      border: 1px solid var(--main-red-color);
      box-shadow: 0 0 0 0.5px var(--main-red-color);
    }

    &:disabled {
      border: 1px solid var(--main-gray-01-color);
      background-color: var(--main-input-bg-color);
      color: var(--main-input-text-color);
    }
  }
`;

export const CommonRadioBtnStyle = styled.div`
  display: inline-block;

  input[type="radio"].common-input-radio {
    appearance: none;
    display: none !important;

    & + label {
      display: inline-block;
      min-width: 45px;
      min-height: 30px;
      padding: 6px 10px;
      border-radius: 20px;
      border: 1px solid var(--main-gray-01-color);
      font-size: 14px;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: var(--main-violet-03-color);
      }
      &.checked {
        background-color: var(--main-violet-02-color);
      }
    }
  }
`;

export const CommonButtonStyle = styled.button<CommonButtonType>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--main-gray-01-color);
  border-radius: 5px;
  color: ${({ textColor }) => textColor};
  background-color: ${({ bgColor }) => bgColor};
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;

  &.small {
    min-width: 48px;
    height: 24px;
    padding: 0 6px;
  }

  &.medium {
    min-width: 100px;
    height: 36px;
    border-radius: 20px;
    padding: 0 20px;
  }

  &.large {
    width: 100%;
    height: 48px;
    padding: 0 12px;
    border-radius: 5px;
    font-size: 16px;
  }
`;
