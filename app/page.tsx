import type { Metadata } from "next"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronDown,
  ExternalLink,
  FileText,
  Folder,
  GitBranch,
  History,
  Info,
  PackageCheck,
  TriangleAlert,
} from "lucide-react"
import { cn } from "@/lib/utils"
import releaseInfo from "@/lib/publishing/release-info.json"
import {
  RELEASE_NOTES,
  findAssetVersion,
  findScreenVersion,
} from "@/lib/publishing/release-note"
import type {
  ReleaseNoteChange,
  ReleaseNoteDetail,
  ReleaseNoteHandoff,
  ReleaseNoteHandoffMode,
} from "@/lib/publishing/release-note"
import handoffAssets from "@/lib/publishing/handoff-assets.json"
import ScreenKeyBadge from "@/components/publishing/screen-key-badge"
import Link from "next/link"
import { existsSync } from "node:fs"
import { join } from "node:path"

const DEPTH_HEADS = ["1뎁스", "2뎁스", "3뎁스", "4뎁스", "5뎁스"]

const REPOSITORY_URL = "https://github.com/fromex-koh/fromex-carbon"
const REPOSITORY_LABEL = "github.com/fromex-koh/fromex-carbon"
const AUTHOR = "이윤화 (웹 퍼블리싱)"

const REPOSITORY_LINKS = [
  {
    term: "저장소",
    href: REPOSITORY_URL,
    branch: "(main 브랜치)",
  },
  {
    term: "FE 전달용",
    href: `${REPOSITORY_URL}/tree/frontend-handoff`,
    branch: "(frontend-handoff 브랜치)",
  },
]

// [퍼블리싱 노출용] 로그인 여부별 헤더를 보여주는 확인용 화면.
// IA_ROWS 와 분리해 두어 화면 개수 집계에 잡히지 않는다.
const HEADER_STATE_ROWS = [
  {
    state: "로그아웃",
    path: "/preview/header",
    menus:
      "탄소중립 선도기업 · K-택소노미 적합성평가 · 고객지원 / 회원가입 · 로그인",
  },
  {
    state: "로그인",
    path: "/preview/header?login=true",
    menus:
      "탄소중립 선도기업 · K-택소노미 적합성평가 · 고객지원 / 마이페이지 · 로그아웃",
  },
]

const IA_ROWS = [
  {
    no: 1,
    path: "/carbon-leader/application/initial",
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "선행 이력이 없어 자가진단만 신청가능",
    cells: [
      { level: 1, name: "메인 홈", rowSpan: 69, colSpan: 1 },
      { level: 2, name: "탄소중립 선도기업", rowSpan: 57, colSpan: 1 },
      { level: 3, name: "선도기업 신청", rowSpan: 6, colSpan: 1 },
      { level: 4, name: "최초 진입", rowSpan: 1, colSpan: 2 },
    ],
  },
  {
    no: 2,
    path: "/carbon-leader/application/self-check-done",
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "자가진단 신청완료(현황조회 노출) / 선도기업 1차 신청가능",
    cells: [{ level: 4, name: "자가진단 완료", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 3,
    path: "/carbon-leader/application/first-done",
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "자가진단·1차 신청 완료 / 중간점검 신청가능",
    cells: [{ level: 4, name: "1차 신청 완료", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 4,
    path: "/carbon-leader/application/middle-review",
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "중간점검 담당자 점검 진행중",
    cells: [{ level: 4, name: "중간점검 접수", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 5,
    path: "/carbon-leader/application/middle-done",
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "중간점검 완료 / 최종점검 신청가능",
    cells: [{ level: 4, name: "중간점검 완료", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 6,
    path: "/carbon-leader/application/final-done",
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "전 단계 완료 / 다음 액션 없음",
    cells: [{ level: 4, name: "최종점검 완료", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 7,
    path: "/carbon-leader/self-check/company-info",
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 1, 정보 입력",
    cells: [
      { level: 3, name: "자가진단", rowSpan: 21, colSpan: 1 },
      { level: 4, name: "기업 정보 입력", rowSpan: 3, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 8,
    path: "/carbon-leader/self-check/company-info/resume",
    user: "회원",
    type: "Modal Popup",
    status: "미표기",
    reviseDone: true,
    devCheck: false,
    uiux: "완료",
    desc: "기존 작성 중인 자가진단이 존재하는 경우 재진입 시 기존 작성내용을 이어서 작성할지 안내함",
    cells: [{ level: 5, name: "이어서 작성하기 팝업", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 9,
    path: "/carbon-leader/self-check/company-info/industry-code-search",
    user: "비회원·회원",
    type: "Modal Popup",
    status: "유지",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "업종코드 조회 팝업 (확인필요)",
    cells: [{ level: 5, name: "업종코드 조회", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 10,
    path: "/carbon-leader/self-check/inventory-emission",
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    revise: true,
    devCheck: false,
    uiux: "대기중",
    desc: "Step 2, 정보 입력 / 계산결과 도출",
    cells: [
      { level: 4, name: "인벤토리 배출량 산정", rowSpan: 4, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 11,
    path: "/carbon-leader/self-check/inventory-emission/item-select",
    user: "비회원·회원",
    type: "Modal Popup",
    status: "신규",
    revise: true,
    devCheck: false,
    uiux: "대기중",
    desc: "인벤토리 항목 선택 팝업",
    cells: [{ level: 5, name: "항목 선택", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 12,
    path: "/carbon-leader/self-check/inventory-emission/scope-guide",
    user: "비회원·회원",
    type: "Dialog",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Scope 설명 팝업",
    cells: [{ level: 5, name: "Scope설명", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 13,
    path: "/carbon-leader/self-check/inventory-emission/detail-input",
    user: "비회원·회원",
    type: "Modal Popup",
    status: "신규",
    revise: true,
    devCheck: false,
    uiux: "대기중",
    desc: "인벤토리 상세 입력 팝업",
    cells: [{ level: 5, name: "상세 입력", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 14,
    path: "/carbon-leader/self-check/reduction-potential",
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 3, 기준연도 배출량 확인, 정보 입력 / 계산결과 도출",
    cells: [
      { level: 4, name: "감축잠재량 산정", rowSpan: 3, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 15,
    path: "/carbon-leader/self-check/reduction-potential/delete-confirm",
    user: "비회원·회원",
    type: "Dialog",
    status: "신규",
    reviseDone: true,
    devCheck: false,
    uiux: "완료",
    desc: "삭제 확인 팝업 - 사업 [삭제] 버튼 선택 시 노출",
    cells: [{ level: 5, name: "삭제 확인 팝업", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 16,
    path: "/carbon-leader/self-check/reduction-potential/change-confirm",
    user: "비회원·회원",
    type: "Modal Popup",
    status: "미표기",
    reviseDone: true,
    devCheck: false,
    uiux: "완료",
    desc: "입력필드 모두 입력 후, 감축 방법론 드롭다운 변경시, 확인팝업. - [변경] 선택 시, 입력필드 초기화",
    cells: [
      { level: 5, name: "감축방법론 변경 확인 팝업", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 17,
    path: "/carbon-leader/self-check/reduction-target",
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 4, 감축율을 아직 고르지 않아 목표 감축량과 적정성 판정이 비어 있는 상태. [다음으로] 비활성",
    cells: [
      { level: 4, name: "감축목표 설정", rowSpan: 3, colSpan: 1 },
      { level: 5, name: "감축율 미선택", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 18,
    path: "/carbon-leader/self-check/reduction-target/fit",
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 4, 예상 감축량이 목표 감축량 이상이라 계획 적정성이 '적정' 인 상태",
    cells: [{ level: 5, name: "이행계획 적정", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 19,
    path: "/carbon-leader/self-check/reduction-target/unfit",
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 4, 예상 감축량이 목표 감축량에 못 미쳐 계획 적정성이 '부적정' 인 상태",
    cells: [{ level: 5, name: "이행계획 부적정", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 20,
    path: "/carbon-leader/self-check/evaluation-index",
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 5, 평가표 작성 / 점수 및 등급 도출 / 버튼 클릭시 결과 확인 모달 팝업 호출",
    cells: [
      { level: 4, name: "평가지표 작성", rowSpan: 4, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 21,
    path: "/carbon-leader/self-check/evaluation-index/mandatory-training",
    user: "비회원·회원",
    type: "Dialog",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: '설명 팝업 1.2.2 탄소중립 전문역량 향상 노력 [4번째 체크항목 "탄소중립 관련 의무 교육을 수료하고 있는 경우" 옆 ?] 선택 시 노출되는 팝업',
    cells: [
      {
        level: 5,
        name: "탄소중립·환경·에너지 분야 관련 의무 교육",
        rowSpan: 1,
        colSpan: 1,
      },
    ],
  },
  {
    no: 22,
    path: "/carbon-leader/self-check/evaluation-index/emission-source-example",
    user: "비회원·회원",
    type: "Dialog",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: '설명 팝업 2.1.1 탄소배출량 산정 [3번째 항목 "(Scope 3) …" 의 * (예시) 중소기업 온실가스 배출원(Scope 1,2,3) 옆 ?] 선택 시 노출되는 팝업',
    cells: [
      {
        level: 5,
        name: "(예시) 중소기업 온실가스 배출원 (Scope 1, 2, 3)",
        rowSpan: 1,
        colSpan: 1,
      },
    ],
  },
  {
    no: 23,
    path: "/carbon-leader/self-check/evaluation-index/certification-type",
    user: "비회원·회원",
    type: "Dialog",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: '설명 팝업 2.2.5 탄소감축 자발적 행동 [4번째 항목 "(제품·기술에 대한 환경분야 국가인증 취득) …" 옆 ?] 선택 시 노출되는 팝업.',
    cells: [
      {
        level: 5,
        name: "국가에서 관리하는 환경분야 인증 종류",
        rowSpan: 1,
        colSpan: 1,
      },
    ],
  },
  {
    no: 24,
    path: "/carbon-leader/self-check/result",
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    reviseDone: true,
    devCheck: false,
    uiux: "완료",
    desc: "Step 6, 결과 확인 화면 , [신청서 출력], [작성완료], [선도기업 신청하기] 버튼 - [신청서 출력] : 선택 시, 신청서 PDF 다운로드 실행 - [작성완료] : 선택 시, 작성 완료 처리 BO에 해당 내역 저장처리되며, [선도기업 신청하기]버튼 활성화 - [선도기업 신청하기] : 선택 시, 선도기업 1차 신청화면으로 이동. 계획 적정성이 '적정' 이고 아직 [작성완료] 를 누르지 않은 첫 상태.",
    cells: [
      { level: 4, name: "결과 확인", rowSpan: 4, colSpan: 1 },
      { level: 5, name: "적정 · 작성완료 활성", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 25,
    path: "/carbon-leader/self-check/result/done",
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    reviseDone: true,
    devCheck: false,
    uiux: "완료",
    desc: "Step 6, [작성완료] 를 누른 뒤. [작성완료] 가 잠기고 [선도기업 신청하기] 가 활성으로 바뀐 상태",
    cells: [{ level: 5, name: "적정 · 신청하기 활성", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 26,
    path: "/carbon-leader/self-check/result/unfit",
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    reviseDone: true,
    devCheck: false,
    uiux: "완료",
    desc: "Step 6, 계획 적정성이 '부적정' 인 상태. 선도기업 신청으로 넘어갈 수 없다",
    cells: [{ level: 5, name: "부적정", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 27,
    path: "/carbon-leader/self-check/result/result-certificate",
    user: "비회원·회원",
    type: "Link",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "결과 보고서 다운로드",
    cells: [
      { level: 5, name: "결과 확인서 (다운로드)", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 28,
    path: "/carbon-leader/application-1/application-form",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 1, 정보 입력(회원정보 및 자가진단 정보 일부 연동) - 탄소중립 기준연도 현황 (자가진단 데이터 불러오기)",
    cells: [
      { level: 3, name: "선도기업 신청 1차", rowSpan: 8, colSpan: 1 },
      { level: 4, name: "신청서 작성", rowSpan: 2, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 29,
    path: "/carbon-leader/application-1/application-form/address-search",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "카카오 주소 검색 API 사용",
    cells: [{ level: 5, name: "주소 검색", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 30,
    path: "/carbon-leader/application-1/document-submit",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 2, 서류 제출 (파일 업로드 기능) , 이전, 다음 버튼",
    cells: [{ level: 4, name: "서류 제출", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 31,
    path: "/carbon-leader/application-1/final-confirm",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 3, 최종확인 화면, 수정하기, 제출하기 버튼",
    cells: [
      { level: 4, name: "최종 확인", rowSpan: 2, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 32,
    path: "/carbon-leader/application-1/final-confirm/submit-confirm",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "신청서 제출 확인 팝업, 취소, 제출하기 버튼",
    cells: [{ level: 5, name: "제출 확인 팝업", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 33,
    path: "/carbon-leader/application-1/result",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 4, 결과 확인 화면 , [출력물 받기], [신청내역 확인] 버튼 - [출력물 받기] : 선택 시, 신청서 PDF 다운로드 실행 - [작성완료] : 선택 시, 작성 완료 처리 BO에 해당 내역 저장처리되며, [신청내역 확인]버튼 활성화 - [신청내역 확인] : 선택 시, 현황조회 화면으로 이동.",
    cells: [
      { level: 4, name: "신청결과 확인", rowSpan: 3, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 34,
    path: "/carbon-leader/application-1/result/application-download",
    user: "비회원·회원",
    type: "Link",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "신청서 다운로드",
    cells: [{ level: 5, name: "신청서 (다운로드)", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 35,
    path: "/carbon-leader/application-1/result/result-certificate",
    user: "비회원·회원",
    type: "Link",
    status: "신규",
    revise: false,
    devCheck: false,
    undecided: true,
    uiux: "대기중",
    desc: "결과 보고서 다운로드 (콘텐츠 미수급), 제공 미정 * 공식 인증을 받는 절차 인하여 현재 개발에 제외될 수 있음",
    cells: [{ level: 5, name: "결과 확인서", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 36,
    path: "/carbon-leader/application-2/application-form",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    needData: true,
    uiux: "대기중",
    desc: "Step 1, 정보 입력(회원정보 및 자가진단 정보 일부 연동) - 탄소중립 기준연도 현황 (자가진단 데이터 불러오기)",
    cells: [
      { level: 3, name: "선도기업 신청 2차", rowSpan: 8, colSpan: 1 },
      { level: 4, name: "신청서 작성", rowSpan: 2, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 37,
    path: "/carbon-leader/application-2/application-form/address-search",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "카카오 주소 검색 API 사용",
    cells: [{ level: 5, name: "주소 검색", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 38,
    path: "/carbon-leader/application-2/document-submit",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 2, 서류 제출 (파일 업로드 기능), 이전, 다음 버튼",
    cells: [{ level: 4, name: "서류 제출", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 39,
    path: "/carbon-leader/application-2/final-confirm",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    needData: true,
    uiux: "대기중",
    desc: "Step 3, 최종확인 화면, 수정하기, 제출하기 버튼",
    cells: [
      { level: 4, name: "최종 확인", rowSpan: 2, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 40,
    path: "/carbon-leader/application-2/final-confirm/submit-confirm",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "신청서 제출 확인 팝업, 취소, 제출하기 버튼",
    cells: [{ level: 5, name: "제출 확인 팝업", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 41,
    path: "/carbon-leader/application-2/result",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 4, 결과 확인 화면 , [출력물 받기], [신청내역 확인] 버튼 - [출력물 받기] : 선택 시, 신청서 PDF 다운로드 실행 - [작성완료] : 선택 시, 작성 완료 처리 BO에 해당 내역 저장처리되며, [신청내역 확인]버튼 활성화 - [신청내역 확인] : 선택 시, 현황조회 화면으로 이동.",
    cells: [
      { level: 4, name: "신청결과 확인", rowSpan: 3, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 42,
    path: "/carbon-leader/application-2/result/application-download",
    user: "비회원·회원",
    type: "Link",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "신청서 다운로드",
    cells: [{ level: 5, name: "신청서 (다운로드)", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 43,
    path: "/carbon-leader/application-2/result/result-certificate",
    user: "비회원·회원",
    type: "Link",
    status: "신규",
    revise: false,
    devCheck: false,
    undecided: true,
    uiux: "대기중",
    desc: "결과 보고서 다운로드 (콘텐츠 미수급), 제공 미정 * 공식 인증을 받는 절차 인하여 현재 개발에 제외될 수 있음",
    cells: [{ level: 5, name: "결과 확인서", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 44,
    path: "/carbon-leader/application-3/application-form",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    needData: true,
    uiux: "대기중",
    desc: "Step 1, 정보 입력, 기업정보 - 내정보 불러오기, 탄소중립 기준연도현황 - 기존데이터 불러오기 기능",
    cells: [
      { level: 3, name: "선도기업 신청 3차", rowSpan: 13, colSpan: 1 },
      { level: 4, name: "신청서 작성", rowSpan: 2, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 45,
    path: "/carbon-leader/application-3/application-form/address-search",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "카카오 주소 검색 API 사용",
    cells: [{ level: 5, name: "주소 검색", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 46,
    path: "/carbon-leader/application-3/inventory-emission",
    user: "회원",
    type: "Page",
    status: "변경",
    revise: true,
    devCheck: false,
    uiux: "대기중",
    desc: "Step 2, 정보 입력 / 계산결과 도출 (자가진단 -인벤토리 배출량 산정과 공통화면)",
    cells: [
      { level: 4, name: "인벤토리 배출량 산정", rowSpan: 4, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 47,
    path: "/carbon-leader/application-3/inventory-emission/item-select",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: true,
    devCheck: false,
    uiux: "대기중",
    desc: "인벤토리 항목 선택 팝업",
    cells: [{ level: 5, name: "항목 선택", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 48,
    path: "/carbon-leader/application-3/inventory-emission/scope-guide",
    user: "회원",
    type: "Dialog",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Scope 설명 팝업",
    cells: [{ level: 5, name: "Scope설명", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 49,
    path: "/carbon-leader/application-3/inventory-emission/detail-input",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: true,
    devCheck: false,
    uiux: "대기중",
    desc: "인벤토리 상세 입력 팝업",
    cells: [{ level: 5, name: "상세 입력", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 50,
    path: "/carbon-leader/application-3/target-achievement",
    user: "회원",
    type: "Page",
    status: "신규",
    reviseDone: true,
    devCheck: false,
    uiux: "대기중",
    desc: "Step 3, 감축목표 설정 vs 배출량 실적 비교 결과 제시",
    cells: [{ level: 4, name: "목표달성 평가", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 51,
    path: "/carbon-leader/application-3/document-submit",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 4, 서류 제출 (파일 업로드 기능), 이전, 다음 버튼",
    cells: [{ level: 4, name: "서류 제출", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 52,
    path: "/carbon-leader/application-3/final-confirm",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    needData: true,
    uiux: "대기중",
    desc: "Step 5, 최종확인 화면, 수정하기, 제출하기 버튼",
    cells: [
      { level: 4, name: "최종 확인", rowSpan: 2, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 53,
    path: "/carbon-leader/application-3/final-confirm/submit-confirm",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "신청서 제출 확인 팝업, 취소, 제출하기 버튼",
    cells: [{ level: 5, name: "제출 확인 팝업", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 54,
    path: "/carbon-leader/application-3/result",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "Step 6, 결과 확인 화면 , [출력물 받기], [신청내역 확인] 버튼 - [출력물 받기] : 선택 시, 신청서 PDF 다운로드 실행 - [작성완료] : 선택 시, 작성 완료 처리 BO에 해당 내역 저장처리되며, [신청내역 확인]버튼 활성화 - [신청내역 확인] : 선택 시, 현황조회 화면으로 이동.",
    cells: [
      { level: 4, name: "신청결과 확인", rowSpan: 3, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 55,
    path: "/carbon-leader/application-3/result/application-download",
    user: "비회원·회원",
    type: "Link",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "신청서 다운로드",
    cells: [{ level: 5, name: "신청서 (다운로드)", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 56,
    path: "/carbon-leader/application-3/result/result-certificate",
    user: "비회원·회원",
    type: "Link",
    status: "신규",
    revise: false,
    devCheck: false,
    undecided: true,
    uiux: "대기중",
    desc: "결과 보고서 다운로드 (콘텐츠 미수급), 제공 미정 * 공식 인증을 받는 절차 인하여 현재 개발에 제외될 수 있음",
    cells: [{ level: 5, name: "결과 확인서", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 57,
    path: "/carbon-leader/application-history",
    user: "회원",
    type: "Link",
    status: "신규",
    revise: false,
    devCheck: false,
    note: "로그인 상태에서 선택 시, 현황조회 화면으로 이동시킴 (화면은 없음)",
    uiux: "완료",
    desc: "로그인 상태에서 선택 시, 현황조회 화면으로 이동시킴 (화면은 없음)",
    cells: [
      {
        level: 3,
        name: "신청내역 확인 및 확인서 발급",
        rowSpan: 1,
        colSpan: 3,
      },
    ],
  },
  {
    no: 58,
    path: "/my-page",
    user: "회원",
    type: "Button",
    status: "신규",
    revise: false,
    devCheck: false,
    note: "[GNB메뉴 - 로그인 시에만 노출](/preview/header?login=true)",
    uiux: "완료",
    desc: "GNB메뉴 - 로그인 시에만 노출",
    cells: [
      { level: 2, name: "마이페이지", rowSpan: 12, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 3 },
    ],
  },
  {
    no: 59,
    path: "/my-page/sub-account",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "기관회원에게만 제공. 하위계정 추가/삭제/수정 - 화면",
    cells: [
      { level: 3, name: "하위계정 관리", rowSpan: 2, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 2 },
    ],
  },
  {
    no: 60,
    path: "/my-page/sub-account/register",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "하위계정 등록 팝업",
    cells: [{ level: 4, name: "하위계정 등록", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 61,
    path: "/my-page/profile-edit",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "기관회원 화면. 기업정보·기업현황·담당자정보에 더해 [비밀번호 변경] 카드가 하나 더 붙는다.",
    cells: [
      { level: 3, name: "회원정보 수정", rowSpan: 5, colSpan: 1 },
      { level: 4, name: "기관회원", rowSpan: 1, colSpan: 2 },
    ],
  },
  {
    no: 62,
    path: "/my-page/profile-edit/company",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "기업회원 화면. 기관회원 화면에서 [비밀번호 변경] 카드만 빠진다.",
    cells: [{ level: 4, name: "기업회원", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 63,
    path: "/my-page/profile-edit/cancel-confirm",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "회원정보 수정 화면에서 [취소] 선택 시 노출. [취소], [확인] 버튼",
    cells: [{ level: 4, name: "수정 취소 확인", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 64,
    path: "/my-page/profile-edit/save-confirm",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "회원정보 수정 화면에서 [저장하기] 선택 시 노출. [취소], [저장] 버튼",
    cells: [{ level: 4, name: "저장 확인", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 65,
    path: "/my-page/profile-edit/address-search",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "카카오 주소 검색 API 사용",
    cells: [{ level: 4, name: "주소검색", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 66,
    path: "/my-page/status",
    user: "회원",
    type: "Page",
    status: "변경",
    reviseDone: true,
    devCheck: false,
    uiux: "완료",
    desc: "로그인 회원만 접근 가능 화면 선도기업 신청 내역 및 선도기업 신청 확인서 발급, 전문가 평가 결과 및 결과 다운로드 - [보완요청 보기] : 버튼 선택시, 보완 요청 팝업 노출.",
    cells: [
      { level: 3, name: "현황조회", rowSpan: 4, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 2 },
    ],
  },
  {
    no: 67,
    path: "/my-page/status/supplement-request",
    user: "회원",
    type: "Modal Popup",
    status: "미표기",
    reviseDone: true,
    devCheck: false,
    uiux: "완료",
    desc: "BO 관리자가 보완요청 시, 입력한 보완요청 내용 문구 노출 - [닫기] 버튼",
    cells: [{ level: 4, name: "보완요청", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 68,
    path: "/my-page/status/empty",
    user: "회원",
    type: "Page",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "현황조회에서 전문평가·K-택소노미·탄소감축 세 묶음이 모두 비었을 때. 묶음마다 빈 안내가 뜨고 [더보기] 는 나오지 않는다.",
    cells: [{ level: 4, name: "내역 없음", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 69,
    path: "/my-page/status/delete-confirm",
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    revise: false,
    devCheck: false,
    uiux: "완료",
    desc: "현황조회 카드의 [⋯] 패널에서 [삭제하기] 선택 시 노출. [취소], [삭제하기] 버튼",
    cells: [{ level: 4, name: "삭제 확인", rowSpan: 1, colSpan: 2 }],
  },
]

const UIUX_VARIANT = {
  대기중: "slate",
  진행중: "blue",
  수정요청: "destructive",
  보완: "orange",
  완료: "forest",
  최종완료: "violet",
} as const

// 비고 칼럼 배지. 모양과 뜻을 한 곳에 두어 표와 범례가 어긋나지 않게 한다.
// badge.tsx 의 미사용 변형은 노랑 계열뿐이라 '디자인 수정완료' 만 토큰으로 덮는다.
const REMARK_BADGES = {
  revise: {
    label: "디자인≠개발",
    variant: "warning",
    className: "",
    desc: "IA 문서에서 셀이 초록색으로 채워진 행. 문서 표기로는 '디자인 > 퍼블 수정필요 부분(개발싱크 또는 현업 전달 사항)'.",
  },
  reviseDone: {
    label: "디자인 수정완료",
    variant: "default",
    className: "bg-brand-done-teal hover:bg-brand-done-teal text-white",
    desc: "'디자인≠개발' 로 잡혔던 부분을 시안대로 반영해 퍼블리싱을 마친 행.",
  },
  devCheck: {
    label: "개발확인필요",
    variant: "tertiary",
    className: "",
    desc: "IA 문서 뎁스 셀에 '- 개발 확인 필요'가 적히고 회색으로 채워진 행.",
  },
  needData: {
    label: "자료수급필요",
    variant: "orange",
    className: "",
    desc: "현업 자료 수급 필요 사항.",
  },
  undecided: {
    label: "미정",
    // 다른 배지와 겹치지 않게 무채색으로 둔다. 라이트는 검정, 다크는 흰 알약이다
    variant: "default",
    className: "bg-ink-strong hover:bg-ink-strong text-surface-field",
    desc: "제공 여부가 아직 정해지지 않은 행. 개발 범위에서 빠질 수 있다.",
  },
} as const

type RemarkKey = keyof typeof REMARK_BADGES

const REMARK_KEYS = Object.keys(REMARK_BADGES) as RemarkKey[]

const RemarkBadge = ({ kind }: { kind: RemarkKey }) => {
  const { label, variant, className } = REMARK_BADGES[kind]

  return (
    <Badge variant={variant} className={cn("whitespace-nowrap", className)}>
      {label}
    </Badge>
  )
}

type UiuxKey = keyof typeof UIUX_VARIANT

// UIUX 진행 상태의 뜻. 범례에서 배지 옆에 함께 보여준다.
const UIUX_DESC: Record<keyof typeof UIUX_VARIANT, string> = {
  대기중: "아직 퍼블리싱을 시작하지 않은 화면.",
  진행중: "퍼블리싱 작업 중인 화면.",
  수정요청: "확인 결과 고칠 부분이 나온 화면.",
  보완: "요청받은 수정을 반영하는 중인 화면.",
  완료: "시안대로 퍼블리싱을 마친 화면.",
  최종완료: "개발·현업 확인까지 끝난 화면.",
}

// 표 아래 범례에 쓰는 순서. UIUX_VARIANT 의 키와 일치해야 한다.
const UIUX_KEYS = Object.keys(UIUX_VARIANT) as UiuxKey[]

const getUiuxVariant = (uiux: string) =>
  uiux in UIUX_VARIANT ? UIUX_VARIANT[uiux as UiuxKey] : "outline"

export const metadata: Metadata = {
  title: "퍼블리싱 인덱스",
}

// 전달 카드 구분별 배지와 카드 색. kibo-ktop 의 Diff 확인·신규 추가·덮어쓰기 표기를 따른다.
// accent 는 배지와 같은 계열의 좌측 띠라, 배지를 읽기 전에 색으로 구분이 먼저 온다.
// highlight 는 최신 릴리스 카드에만 얹는 옅은 면색이다(같은 계열, 낮은 농도).
const HANDOFF_PRESENTATION: Record<
  ReleaseNoteHandoffMode,
  {
    label: string
    variant: "blue" | "success" | "violet"
    accent: string
    highlight: string
  }
> = {
  diff: {
    label: "Diff 확인",
    variant: "blue",
    accent: "border-l-blue-600",
    highlight: "border-blue-500/40 bg-blue-500/10",
  },
  new: {
    label: "신규 추가",
    variant: "success",
    accent: "border-l-green-600",
    highlight: "border-green-500/40 bg-green-500/10",
  },
  overwrite: {
    label: "덮어쓰기",
    variant: "violet",
    accent: "border-l-violet-600",
    highlight: "border-violet-500/40 bg-violet-500/10",
  },
}

// 카드 정렬 순서. 기존 파일을 손대는 것부터 먼저 보고 신규는 마지막에 본다.
// Diff 확인 → 덮어쓰기 → 신규 추가 순으로 버전마다 다시 정렬한다.
const HANDOFF_ORDER: ReleaseNoteHandoffMode[] = ["diff", "overwrite", "new"]

const handoffRank = (mode: ReleaseNoteHandoffMode) =>
  HANDOFF_ORDER.indexOf(mode)

// 화면 키는 라우트 경로에서 파생한다. 경로가 곧 유일한 출처다.
const toScreenKey = (routePath: string) =>
  routePath.replace(/^\//, "").replaceAll("/", "-")

// 화면은 모두 (site)/(content) 아래에 만든다.
// page.tsx 가 실제로 있는 행만 이름에 링크를 건다.
const CONTENT_ROOT = join(process.cwd(), "app", "(site)", "(content)")

const hasPage = (routePath: string) =>
  existsSync(join(CONTENT_ROOT, routePath, "page.tsx"))

// 방금 배포한 것만 강조한다. 두 표와 릴리스 카드가 같은 파랑 계열을 쓴다.
// TableRow 원본의 hover:bg-muted/50 이 강조를 덮으므로 hover 도 같이 지정한다.
// cn 이 tailwind-merge 라 나중에 들어오는 className 쪽이 이긴다.
// 링크 글자색. 다크의 --primary 는 카드 위 대비가 3.63:1 로 AA(4.5:1)에 못 미친다.
// 같은 브랜드 계열 한 단계 밝은 --primary-light 로 올려 4.67:1 을 확보한다.
// 라이트는 --primary 가 5.50:1 이라 그대로 둔다.

const LATEST_HIGHLIGHT = "bg-primary/15 hover:bg-primary/25"

const COMMIT_LINK_LABELS = ["커밋", "GitHub Diff", "Diff 링크"]
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g

// 커밋 계열 라벨의 값은 "[변경사항 보기](URL)" 형태로 적는다. 링크로 바꿔 준다.
const parseCommitLinks = (label: string, value: string) => {
  if (!COMMIT_LINK_LABELS.includes(label)) return []
  return [...value.matchAll(MARKDOWN_LINK_PATTERN)].map((match) => ({
    text: match[1],
    href: match[2],
  }))
}

/**
 * 비고 메모. "[글](/경로)" 형태가 있으면 그 부분만 링크로 바꾼다.
 * 표기법은 릴리스 카드의 커밋 링크와 같게 맞췄다.
 */
const RemarkNote = ({ note }: { note: string }) => {
  const parts: React.ReactNode[] = []
  let cursor = 0

  for (const match of note.matchAll(MARKDOWN_LINK_PATTERN)) {
    const start = match.index ?? 0
    if (start > cursor) parts.push(note.slice(cursor, start))
    parts.push(
      <Link
        key={`${match[2]}-${start}`}
        href={match[2]}
        className="text-primary dark:text-primary-light rounded hover:underline"
      >
        {match[1]}
      </Link>,
    )
    cursor = start + match[0].length
  }
  if (cursor < note.length) parts.push(note.slice(cursor))

  return (
    <span className="text-muted-foreground text-xs break-keep whitespace-normal">
      {parts}
    </span>
  )
}

const ReleaseNoteDetailValue = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  const commitLinks = parseCommitLinks(label, value)

  if (commitLinks.length > 0) {
    // 커밋 링크는 카드에서 유일하게 밖으로 나가는 동선이라 본문 글자색으로 두면 묻힌다.
    // Diff 배지와 같은 파랑을 채워 버튼처럼 보이게 한다.
    return (
      <span className="flex flex-col gap-1">
        {commitLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
            {link.text} (새 창)
          </a>
        ))}
      </span>
    )
  }

  return <span className="break-keep">{value}</span>
}

// 한 카드에 변경·결과·주의가 2~3줄씩 반복된다. 이어지는 같은 라벨은 한 번만 적는다.
const groupDetails = (details: ReleaseNoteDetail[]) =>
  details.reduce<{ label: string; values: string[] }[]>((groups, detail) => {
    const last = groups.at(-1)

    if (last?.label === detail.label) {
      last.values.push(detail.value)
      return groups
    }

    return [...groups, { label: detail.label, values: [detail.value] }]
  }, [])

const ReleaseNoteHandoffCard = ({
  change,
  isLatest = false,
}: {
  change: ReleaseNoteHandoff
  /** 최신 릴리스의 카드만 배경으로 강조한다 */
  isLatest?: boolean
}) => {
  const { label, variant, accent, highlight } =
    HANDOFF_PRESENTATION[change.mode]
  const groups = groupDetails(change.details)
  // 대상은 경로 목록, 주의는 경고 블록으로 따로 뽑는다. 나머지는 본문에 그대로 쌓는다.
  const targets = groups
    .filter((group) => group.label === "대상")
    .flatMap((group) => group.values)
    .flatMap((value) => value.split("\n"))
  const cautions = groups
    .filter((group) => group.label === "주의")
    .flatMap((group) => group.values)
  const body = groups.filter(
    (group) => group.label !== "대상" && group.label !== "주의",
  )

  return (
    <section
      className={cn(
        "border-border bg-card flex flex-col gap-4 rounded-lg border border-l-4 p-5",
        isLatest && highlight,
        // 좌측 띠는 면색보다 뒤에 둬야 tailwind-merge 가 남긴다.
        accent,
      )}
    >
      <div className="flex flex-col gap-2">
        <Badge variant={variant} className="w-fit">
          {label}
        </Badge>
        <h4 className="text-base font-bold break-keep">{change.title}</h4>
      </div>

      {targets.length > 0 && (
        // 파일 경로 패널. 카드 면색이 구분별로 달라져 회색으로는 묻힌다.
        // 어느 카드 위에서도 같게 읽히도록 흰 면색과 짙은 글자로 고정한다.
        <div className="flex flex-col gap-2 rounded-md border border-l-4 border-slate-300 border-l-slate-400 bg-white p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Folder aria-hidden="true" className="size-3.5 shrink-0" />
            대상 파일
          </p>
          <ul className="flex flex-col gap-1">
            {targets.map((target) => (
              <li key={target} className="flex items-start gap-1.5">
                {target.endsWith("/") ? (
                  <Folder
                    aria-hidden="true"
                    className="mt-0.5 size-3.5 shrink-0 text-blue-600"
                  />
                ) : (
                  <FileText
                    aria-hidden="true"
                    className="mt-0.5 size-3.5 shrink-0 text-slate-500"
                  />
                )}
                <code className="font-mono text-xs break-all text-slate-900">
                  {target}
                </code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {body.length > 0 && (
        <dl className="flex flex-col gap-3 text-sm">
          {body.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs font-medium">
                {group.label}
              </dt>
              {group.values.map((value) => (
                <dd key={value} className="break-keep">
                  <ReleaseNoteDetailValue label={group.label} value={value} />
                </dd>
              ))}
            </div>
          ))}
        </dl>
      )}

      {cautions.length > 0 && (
        // 경고 콜아웃. 흰색인 대상 패널과 구분되도록 흰색에 가까운 노랑으로 채운다.
        <div className="flex flex-col gap-2 rounded-md border border-l-4 border-yellow-300 border-l-yellow-500 bg-yellow-50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-yellow-800">
            <TriangleAlert aria-hidden="true" className="size-3.5 shrink-0" />
            주의
          </p>
          <ul className="flex flex-col gap-1.5">
            {cautions.map((caution) => (
              <li key={caution} className="text-sm break-keep text-yellow-950">
                {caution}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

const isHandoffChange = (
  change: ReleaseNoteChange,
): change is ReleaseNoteHandoff => typeof change !== "string"

const formatReleaseDate = (isoDate: string) => {
  if (!isoDate) return "-"

  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
    new Date(isoDate),
  )
}

const formatReleasedAt = (isoDate: string) => {
  if (!isoDate) return ""

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(isoDate))
}

const PublishingIndexPage = () => {
  const releasedAt = formatReleasedAt(releaseInfo.releasedAt)
  const releaseNotes = RELEASE_NOTES

  return (
    <div className="flex w-full flex-col items-center px-4 py-10">
      <div className="flex w-full max-w-[1276px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold sm:text-2xl">퍼블리싱 인덱스</h1>
            <Badge variant="forest" className="text-sm">
              탄소중립 플랫폼 FO · IA V1.3_260826
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            현재 버전:{" "}
            <span className="text-foreground font-medium">
              {releaseInfo.version}
            </span>
            {releasedAt && ` / ${releasedAt}`}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info
                aria-hidden="true"
                className="text-primary size-5 shrink-0"
              />
              프로젝트 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="flex flex-col gap-3 text-sm">
              {REPOSITORY_LINKS.map((link) => (
                <div
                  key={link.term}
                  className="flex flex-wrap items-center gap-3"
                >
                  <dt className="text-muted-foreground w-20 shrink-0">
                    {link.term}
                  </dt>
                  <dd>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary dark:text-primary-light inline-flex items-center gap-1.5 rounded font-medium break-all hover:underline"
                    >
                      <GitBranch
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                      {REPOSITORY_LABEL}
                      <span className="text-muted-foreground whitespace-nowrap">
                        {link.branch}
                      </span>
                      <span className="sr-only"> (새 창에서 열림)</span>
                    </a>
                  </dd>
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-3">
                <dt className="text-muted-foreground w-20 shrink-0">작업자</dt>
                <dd>{AUTHOR}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History
                aria-hidden="true"
                className="text-primary size-5 shrink-0"
              />
              버전 업데이트
            </CardTitle>
          </CardHeader>
          <CardContent>
            {releaseNotes.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                아직 릴리스가 없습니다. RELEASE_NOTES_DRAFT.md 에 작성하면 main
                릴리스 때 여기에 쌓입니다.
              </p>
            ) : (
              // 릴리스가 쌓이면 페이지가 계속 길어지므로 높이를 묶고 안에서 스크롤한다.
              // 원본(max-h-100)보다 키우고, 카드도 2열로 나눠 한 화면에 더 들어오게 했다.
              <div className="max-h-150 overflow-auto overscroll-contain pr-1">
                <div className="flex flex-col gap-8">
                  {releaseNotes.map((note, noteIndex) => {
                    const summaries = note.changes.filter(
                      (change) => !isHandoffChange(change),
                    )
                    const handoffs = note.changes
                      .filter(isHandoffChange)
                      .toSorted(
                        (left, right) =>
                          handoffRank(left.mode) - handoffRank(right.mode),
                      )

                    // 구분별 건수. 카드를 세지 않아도, 접힌 릴리스를 펼치지 않아도
                    // 이번 릴리스의 규모를 머리에서 바로 읽을 수 있다.
                    const handoffCounts = HANDOFF_ORDER.map((mode) => ({
                      mode,
                      count: handoffs.filter((change) => change.mode === mode)
                        .length,
                    })).filter((entry) => entry.count > 0)

                    const heading = (
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={noteIndex === 0 ? "default" : "outline"}
                        >
                          {note.version}
                        </Badge>
                        <span className="text-muted-foreground text-sm">
                          {formatReleaseDate(note.releasedAt)}
                        </span>
                        {noteIndex === 0 && (
                          <span className="text-muted-foreground text-xs">
                            최신
                          </span>
                        )}
                        {handoffCounts.map(({ mode, count }) => (
                          <Badge
                            key={mode}
                            variant={HANDOFF_PRESENTATION[mode].variant}
                          >
                            {HANDOFF_PRESENTATION[mode].label} {count}
                          </Badge>
                        ))}
                      </div>
                    )

                    const body = (
                      <div className="flex flex-col gap-5">
                        {summaries.length > 0 && (
                          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm break-keep">
                            {summaries.map((change) => (
                              <li key={String(change)}>{String(change)}</li>
                            ))}
                          </ul>
                        )}
                        {handoffs.length > 0 && (
                          <div className="flex flex-col gap-3">
                            <p className="text-muted-foreground text-xs font-medium">
                              프론트엔드 전달 항목 {handoffs.length}건
                            </p>
                            <div className="flex flex-col gap-3">
                              {handoffs.map((change) => (
                                <ReleaseNoteHandoffCard
                                  key={`${change.mode}-${change.title}`}
                                  change={change}
                                  isLatest={noteIndex === 0}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )

                    // 최신만 펼쳐 둔다. 이전 릴리스는 접어야 목록이 길어지지 않는다.
                    return noteIndex === 0 ? (
                      <section
                        key={note.version}
                        className="flex flex-col gap-4"
                      >
                        {/* 스크롤 중에도 지금 보는 릴리스가 무엇인지 남아 있어야 한다. */}
                        <div className="bg-card sticky top-0 z-10 border-b pt-1 pb-2">
                          {heading}
                        </div>
                        {body}
                      </section>
                    ) : (
                      <details key={note.version} className="group">
                        <summary className="bg-card sticky top-0 z-10 flex cursor-pointer items-center gap-2 border-b pt-1 pb-2">
                          {heading}
                          <ChevronDown
                            aria-hidden="true"
                            className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180"
                          />
                        </summary>
                        <div className="pt-4">{body}</div>
                      </details>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PackageCheck
                aria-hidden="true"
                className="text-primary size-5 shrink-0"
              />
              프론트엔드 인계 자산
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ul className="text-muted-foreground flex list-disc flex-col gap-1 pl-5 text-sm break-keep">
              <li>
                <code className="text-foreground font-mono">main</code> 은
                퍼블리싱 제작·검수용 브랜치입니다. 프론트엔드 개발은 검증된
                결과만 제공하는{" "}
                <code className="text-foreground font-mono">
                  frontend-handoff
                </code>{" "}
                브랜치를 내려받아 시작합니다.
              </li>
              <li>
                아래 표는 전달 자산의 원본 경로와 마지막 반영 버전이며, 이번
                버전에 반영된 항목은 강조해 표시합니다.
              </li>
            </ul>
            <div className="border-border overflow-hidden rounded-md border">
              <div className="max-h-100 overflow-auto overscroll-contain [&>div]:overflow-visible">
                <Table>
                  <TableHeader className="[&_th]:bg-muted [&_th]:sticky [&_th]:top-0">
                    <TableRow>
                      <TableHead className="min-w-[5rem]">구분</TableHead>
                      <TableHead className="min-w-[11rem]">원본 경로</TableHead>
                      <TableHead className="min-w-[16rem]">역할</TableHead>
                      <TableHead className="min-w-[7rem]">반영 버전</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {handoffAssets.map((asset) => {
                      const assetVersion = findAssetVersion(asset.path)

                      return (
                        <TableRow
                          key={asset.path}
                          className={cn(
                            assetVersion.isCurrent && LATEST_HIGHLIGHT,
                          )}
                        >
                          <TableCell className="text-muted-foreground align-top text-sm">
                            <span className="flex items-center gap-1.5">
                              {asset.kind === "폴더" ? (
                                <Folder
                                  aria-hidden="true"
                                  className="text-primary size-4 shrink-0"
                                />
                              ) : (
                                <FileText
                                  aria-hidden="true"
                                  className="size-4 shrink-0"
                                />
                              )}
                              {asset.kind}
                            </span>
                          </TableCell>
                          <TableCell className="align-top font-mono text-sm">
                            {asset.path}
                          </TableCell>
                          <TableCell className="align-top text-sm break-keep">
                            {asset.role}
                          </TableCell>
                          <TableCell className="align-top">
                            <Badge
                              variant={
                                assetVersion.isCurrent ? "default" : "outline"
                              }
                            >
                              {assetVersion.version}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* [퍼블리싱 노출용] IA 화면이 아니라 확인용이라 아래 화면 개수에 넣지 않는다. */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info aria-hidden="true" className="size-4" />
              헤더 상태 확인
            </CardTitle>
            <p className="text-muted-foreground text-sm break-keep">
              로그인 여부에 따른 GNB 메뉴 구성을 보는 화면입니다. IA 화면이
              아니라서 아래 화면 개수에 포함되지 않습니다.
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="[&_th]:bg-muted">
                <TableRow>
                  <TableHead className="min-w-[7rem]">상태</TableHead>
                  <TableHead className="min-w-[16rem]">경로</TableHead>
                  <TableHead className="min-w-[20rem]">노출 메뉴</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {HEADER_STATE_ROWS.map((row) => (
                  <TableRow key={row.state}>
                    <TableCell className="align-top text-sm font-medium">
                      {row.state}
                    </TableCell>
                    <TableCell className="align-top font-mono text-sm">
                      <Link
                        href={row.path}
                        className="text-primary dark:text-primary-light hover:underline"
                      >
                        {row.path}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground align-top text-sm break-keep">
                      {row.menus}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">
            총{" "}
            <span className="text-foreground font-medium">
              {IA_ROWS.length}
            </span>
            개 화면
          </p>
          <p className="text-muted-foreground text-xs">
            IA 문서 V1.3_260826 기준입니다. &apos;유지&apos;(기존 화면 그대로)로
            적힌 행은 목록에서 제외했고, 새 화면 안에서 그대로 다시 쓰는 팝업만
            남겨 두었습니다.
          </p>
          <p className="text-muted-foreground text-xs">
            메뉴 자체가 화면인 행의 미사용 하위 뎁스는 병합된 &apos;-&apos;로
            표시합니다.
          </p>
          {/* 배지 뜻풀이. 표에 실제로 쓰인 것만 건수와 함께 보여준다.
              한 건도 없는 값(진행중·수정요청 등)은 그리지 않는다. */}
          <div className="border-border bg-muted/30 flex flex-col gap-4 rounded-lg border p-4">
            {[
              {
                column: "비고",
                items: REMARK_KEYS.map((kind) => ({
                  key: kind,
                  badge: <RemarkBadge kind={kind} />,
                  desc: REMARK_BADGES[kind].desc,
                  count: IA_ROWS.filter((row) => row[kind]).length,
                })),
              },
              {
                column: "UIUX",
                items: UIUX_KEYS.map((key) => ({
                  key,
                  badge: <Badge variant={UIUX_VARIANT[key]}>{key}</Badge>,
                  desc: UIUX_DESC[key],
                  count: IA_ROWS.filter((row) => row.uiux === key).length,
                })),
              },
            ].map((group) => {
              const used = group.items.filter((item) => item.count > 0)
              if (used.length === 0) return null

              return (
                <div key={group.column} className="flex flex-col gap-2">
                  <p className="text-foreground text-xs font-bold">
                    {group.column} 칼럼
                  </p>
                  <dl className="flex flex-col gap-2">
                    {used.map((item) => (
                      <div
                        key={item.key}
                        className="flex flex-col gap-1 sm:flex-row sm:gap-3"
                      >
                        <dt className="shrink-0 sm:w-30">{item.badge}</dt>
                        <dd className="text-muted-foreground text-xs break-keep">
                          {item.desc}{" "}
                          <span className="text-foreground font-medium">
                            {item.count}건
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )
            })}
          </div>
        </div>

        <Table className="border-border border-t">
          <TableHeader>
            <TableRow className="bg-muted/25">
              {DEPTH_HEADS.map((head) => (
                <TableHead
                  key={head}
                  className="border-border min-w-[9rem] border-r"
                >
                  {head}
                </TableHead>
              ))}
              <TableHead className="border-border min-w-[5rem] border-r">
                화면 Type
              </TableHead>
              <TableHead className="border-border min-w-[8rem] border-r">
                비고
              </TableHead>
              <TableHead className="border-border min-w-[5rem] border-r">
                UIUX
              </TableHead>
              <TableHead className="min-w-[6rem]">버전</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {IA_ROWS.map((row) => {
              const isTopLevel = row.cells[0]?.level === 1
              const hasScreenFile = hasPage(row.path)
              // 반영 버전은 릴리스 때 만들어진 스냅샷에서 읽는다. 행에는 적지 않는다.
              const screenVersion = findScreenVersion(row.path)
              // level 0 은 병합된 빈 칸이다. 그 행이 가리키는 실제 화면은
              // 마지막 이름 있는 뎁스이며, 그 배지에만 키 복사를 붙인다.
              const screenCellIndex = row.cells.reduce(
                (last, cell, index) => (cell.level === 0 ? last : index),
                -1,
              )

              return (
                <TableRow
                  key={row.no}
                  className={cn(
                    isTopLevel && "bg-muted/40",
                    screenVersion.isCurrent && LATEST_HIGHLIGHT,
                  )}
                >
                  {row.cells.map((cell, index) =>
                    cell.level === 0 ? (
                      <TableCell
                        key={row.no + "-none-" + index}
                        colSpan={cell.colSpan}
                        className="border-border text-muted-foreground border-r align-top"
                      >
                        -
                      </TableCell>
                    ) : (
                      <th
                        key={row.no + "-" + cell.level}
                        scope="row"
                        rowSpan={cell.rowSpan}
                        colSpan={cell.colSpan}
                        className="border-border border-r border-b p-2 text-left align-top font-normal"
                      >
                        <span className="flex flex-col gap-1">
                          {index === screenCellIndex ? (
                            <ScreenKeyBadge
                              depth={cell.level}
                              screenKey={toScreenKey(row.path)}
                            />
                          ) : (
                            <Badge variant="outline" className="w-fit">
                              {cell.level}
                            </Badge>
                          )}
                          <span className="text-sm font-medium break-keep">
                            {index === screenCellIndex && hasScreenFile ? (
                              <Link
                                href={row.path}
                                className="text-primary dark:text-primary-light rounded hover:underline"
                              >
                                {cell.name}
                              </Link>
                            ) : (
                              cell.name
                            )}
                          </span>
                        </span>
                      </th>
                    ),
                  )}

                  <TableCell className="border-border border-r align-top text-xs whitespace-nowrap">
                    {row.type}
                  </TableCell>
                  <TableCell className="border-border border-r align-top">
                    {row.revise ||
                    row.reviseDone ||
                    row.devCheck ||
                    row.needData ||
                    row.undecided ||
                    row.note ? (
                      <span className="flex flex-col items-start gap-1">
                        {row.revise && <RemarkBadge kind="revise" />}
                        {row.reviseDone && <RemarkBadge kind="reviseDone" />}
                        {row.devCheck && <RemarkBadge kind="devCheck" />}
                        {row.needData && <RemarkBadge kind="needData" />}
                        {row.undecided && <RemarkBadge kind="undecided" />}
                        {/* 배지로 나타내기 어려운 한 줄 메모. 화면이 없는 이동 링크 등에 쓴다 */}
                        {row.note && <RemarkNote note={row.note} />}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="border-border border-r align-top">
                    <Badge variant={getUiuxVariant(row.uiux)}>{row.uiux}</Badge>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge
                      variant={screenVersion.isCurrent ? "default" : "outline"}
                    >
                      {screenVersion.version}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default PublishingIndexPage
