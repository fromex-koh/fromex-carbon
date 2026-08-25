export const navBarHeight = 90

export const menuList = [
  {
    title: "탄소감축",
    link: "/carbon/carbon-reduction",
    contents: [
      { subTitle: "탄소감축 안내", link: "/guide", subContents: [] },
      { subTitle: "자가진단", link: "/self-check", subContents: [] },
    ],
  },
  {
    title: "K-택소노미",
    link: "/carbon/k-taxonomy",
    contents: [
      { subTitle: "K-택소노미 안내", link: "/guide", subContents: [] },
      { subTitle: "자가진단", link: "/selected-self-check", subContents: [] },
      { subTitle: "자가진단 진행", link: "/self-check", subContents: [] },
      {
        subTitle: "자가진단 결과",
        link: "/self-check-result",
        subContents: [],
      },
    ],
  },
  {
    title: "고객지원",
    link: "",
    contents: [
      {
        subTitle: "자주 묻는 질문",
        link: "/carbon/home?isFocusFaq=true",
        subContents: [],
      },
      {
        subTitle: "질문답변방",
        link: "https://www.kibo.or.kr/main/board/boardType24.do",
        subContents: [],
      },
    ],
  },
]
