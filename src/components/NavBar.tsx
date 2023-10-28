import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import ArConnect from "../images/ArConnect";
import Arweave from "../images/Arweave-app";
import useNavBar from "../stores/useNavBar";
import connect, { automatically_connect } from "../utils/connect";
import { useEffect } from "react";
import useAddress from "../stores/useAddress";
import Profile from "./Profile";
export default function NavBar() {
  const address = useAddress((state) => state.address);
  const type = useAddress((state) => state.type);
  useEffect(() => {
    automatically_connect();
  }, [address, type]);
  const setType = useNavBar((state) => state.setType);
  const _type = useNavBar((state) => state.type);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Navbar isBordered={true} isBlurred={false}>
        <NavbarBrand>
          <p className="font-bold text-inherit">picture.studio</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <ButtonGroup variant="flat">
              {address?.length && type?.length ? (
                <>
                  <Button
                    aria-label="user"
                    color="primary"
                    className="rounded overflow-hidden"
                    startContent={<UserIcon />}
                    onPress={onOpen}
                  >
                    <span className="truncate" style={{ maxWidth: "10.25em" }}>
                      {address}
                    </span>
                  </Button>
                  <Profile
                    onOpen={onOpen}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                  />
                </>
              ) : (
                <>
                  <Button
                    endContent={
                      _type === "arconnect" ? (
                        <ArConnect />
                      ) : _type === "arweave.app" ? (
                        <Arweave />
                      ) : _type === null ? (
                        <Spinner />
                      ) : null
                    }
                    onClick={() => connect()}
                  >
                    {!_type ? <Spinner /> : <>Connect with {_type}</>}
                  </Button>
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Button isIconOnly>
                        <ChevronDownIcon />
                      </Button>
                    </DropdownTrigger>
                    {_type ? (
                      <DropdownMenu
                        disallowEmptySelection
                        defaultSelectedKeys={[_type]}
                        aria-label="Merge options"
                        selectedKeys={[_type]}
                        selectionMode="single"
                        onSelectionChange={(e) =>
                          ([...e][0] as string) === "arweave.app"
                            ? setType("arweave.app")
                            : ([...e][0] as string) === "arconnect"
                            ? setType("arconnect")
                            : null
                        }
                        className="max-w-[300px]"
                      >
                        <DropdownItem
                          key="arconnect"
                          endContent={<ArConnect />}
                          showDivider={true}
                        >
                          Connect with arconnect
                        </DropdownItem>
                        <DropdownItem
                          showDivider={true}
                          key="arweave.app"
                          endContent={<Arweave />}
                        >
                          Connect with arweave.app
                        </DropdownItem>
                      </DropdownMenu>
                    ) : null}
                  </Dropdown>
                </>
              )}
            </ButtonGroup>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
const ChevronDownIcon = () => (
  <svg
    fill="none"
    height="14"
    viewBox="0 0 24 24"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
      fill="currentColor"
    />
  </svg>
);

// eslint-disable-next-line react-refresh/only-export-components
const UserIcon = () => {
  return (
    <svg
      data-name="Iconly/Curved/Profile"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          data-name="Stroke 1"
          d="M11.845 21.662C8.153 21.662 5 21.088 5 18.787s3.133-4.425 6.845-4.425c3.692 0 6.845 2.1 6.845 4.4s-3.134 2.9-6.845 2.9z"
        />
        <path
          data-name="Stroke 3"
          d="M11.837 11.174a4.372 4.372 0 10-.031 0z"
        />
      </g>
    </svg>
  );
};
