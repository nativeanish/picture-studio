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
} from "@nextui-org/react";
import { BiSolidUser } from "react-icons/bi";
import { AiFillVideoCamera } from "react-icons/ai";
import { VscDebugDisconnect } from "react-icons/vsc";
import { FaChevronDown } from "react-icons/fa";
import ArConnect from "../images/ArConnect";
import Arweave from "../images/Arweave-app";
import useNavBar from "../stores/useNavBar";
import connect, { automatically_connect } from "../utils/connect";
import { useEffect } from "react";
import useAddress from "../stores/useAddress";
import disconnect from "../utils/disconnect";
import { useNavigate } from "react-router-dom";
export default function NavBar() {
  const address = useAddress((state) => state.address);
  const type = useAddress((state) => state.type);
  useEffect(() => {
    automatically_connect();
  }, [address, type]);
  const setType = useNavBar((state) => state.setType);
  const _type = useNavBar((state) => state.type);
  const navigate = useNavigate();
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
                    startContent={<BiSolidUser size={"24"} />}
                  >
                    <span className="truncate" style={{ maxWidth: "10.25em" }}>
                      {address}
                    </span>
                  </Button>
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Button isIconOnly color="primary">
                        <FaChevronDown size="18" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      aria-label="Action"
                      selectionMode="single"
                    >
                      <DropdownItem
                        key="studio"
                        showDivider={true}
                        startContent={<AiFillVideoCamera size={"20"} />}
                        onClick={() => navigate("/studio")}
                      >
                        Studio
                      </DropdownItem>
                      <DropdownItem
                        showDivider={true}
                        key="disconnect"
                        startContent={<VscDebugDisconnect size={"20"} />}
                        onClick={() => disconnect()}
                      >
                        Disconnect
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Button
                    endContent={
                      _type === "arconnect" ? (
                        <ArConnect />
                      ) : _type === "arweave.app" ? (
                        <Arweave />
                      ) : _type === null ? null : null
                    }
                    onClick={() => connect()}
                    color="default"
                    variant="bordered"
                  >
                    {!_type ? <Spinner /> : <>Connect with {_type}</>}
                  </Button>
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      {!_type ? (
                        <Spinner />
                      ) : (
                        <Button isIconOnly color="default" variant="bordered">
                          <FaChevronDown size="18" />
                        </Button>
                      )}
                    </DropdownTrigger>
                    {_type ? (
                      <DropdownMenu
                        disallowEmptySelection
                        defaultSelectedKeys={[_type]}
                        aria-label="Optios"
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
