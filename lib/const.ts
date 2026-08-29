export const navBarHeight = 90

export const menuList = [
  {
    title: "탄소중립 선도기업",
    link: "/carbon-leader",
    contents: [
      {
        subTitle: "선도기업 신청",
        link: "/application/initial",
        subContents: [],
      },
      {
        subTitle: "자가진단",
        link: "/self-check/company-info",
        subContents: [],
      },
      {
        subTitle: "신청내역 확인 및 확인서 발급",
        link: "/application-history",
        subContents: [],
      },
    ],
  },
  {
    title: "K-택소노미 적합성평가",
    link: "/k-taxonomy-assessment",
    contents: [
      { subTitle: "찾아보기", link: "/search", subContents: [] },
      { subTitle: "자가진단", link: "/self-check", subContents: [] },
      { subTitle: "전문평가", link: "/expert-assessment", subContents: [] },
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

// [퍼블리싱 노출용] 마이페이지는 GNB 드롭다운 행이 아니라
// 우측 유틸 영역(비로그인 상태의 '회원가입' 자리)에 놓인다.
// menuList 와 형태를 맞춰 두어 nav-bar 가 같은 드롭다운 마크업을 재사용한다.
export const myPageMenu = {
  title: "마이페이지",
  link: "/my-page",
  contents: [
    { subTitle: "하위계정 관리", link: "/sub-account", subContents: [] },
    { subTitle: "회원정보 수정", link: "/profile-edit", subContents: [] },
    { subTitle: "현황조회", link: "/status", subContents: [] },
  ],
}
